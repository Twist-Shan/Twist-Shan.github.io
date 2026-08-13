---
title: "Tokenization: From Building BPE from Scratch to Language Models Without a Fixed Tokenizer"
date: 2026-07-11
description: "Notes on how tokenization works, how to implement byte-level BPE, where fixed subword tokenization fails, and where byte-level and dynamically chunked models may go next."
---

# Tokenization: From Building BPE from Scratch to Language Models Without a Fixed Tokenizer

> This article is written for readers who want to understand tokenization deeply enough to implement it. Its main thread comes from [Stanford CS336: Language Modeling from Scratch](https://cs336.stanford.edu/), the executable [CS336 Lecture 1 notes](https://github.com/stanford-cs336/lectures/blob/main/lecture_01.py), Andrej Karpathy's [Let's build the GPT Tokenizer](https://www.youtube.com/watch?v=zduSFxRajkE), and [minBPE](https://github.com/karpathy/minbpe). The research survey is current through **July 11, 2026**.

> A note on evidence: the article explicitly labels selected arXiv papers and preprints. Reported scale, speedups, and downstream results are the authors' findings; they have not necessarily been independently reproduced across hardware, languages, and training recipes. “Recent” identifies the research frontier—it does not imply that every conclusion is settled.

## Four ideas to remember

1. **A token is not a word, and it need not have linguistic meaning.** A token ID indexes rows in the embedding table and LM head, and it represents one unit of autoregressive prediction.
2. **BPE is a greedy compression heuristic, not a semantic or linguistic segmenter.** It favors byte or character sequences that occur next to each other frequently in its training corpus.
3. **A tokenizer is part of the model design.** It determines sequence length, vocabulary parameters, how much compute a passage receives, how much content fits in the context window, and the relative cost of different languages.
4. **The future is probably not “no chunks at all,” but no fixed external subword vocabulary.** Models will still need larger computational units, but their boundaries may become dynamic, hierarchical, and jointly learned with the language model.

---

## 1. What does a tokenizer actually do?

For a lossless byte-level tokenizer, we can write:

\[
E: \text{Bytes}^{*}\rightarrow \{0,\ldots,V-1\}^{*}, \qquad
D(E(x))=x.
\]

Here:

- `E` (encode) maps raw bytes to token IDs;
- `D` (decode) concatenates the bytes associated with those IDs and reconstructs the input;
- `V` is the vocabulary size.

A standard training pipeline maximizes the likelihood of the token sequence produced by the canonical encoding `t = E(x)`:

\[
q_E(t)=\prod_{i=1}^{T}p(t_i\mid t_{<i}), \qquad (t_1,\ldots,t_T)=E(x).
\]

This quantity is not necessarily the exact probability of the decoded string. Multiple non-canonical ID sequences can decode to the same bytes, so a true string probability would have to sum over all such paths with consistent EOS handling. Standard training exposes only the canonical path. Even so, the tokenizer changes the factorization used for training: `E` decides how many prediction steps a passage requires and how much text each step covers.

If the pipeline applies lossy or non-invertible normalization such as lowercasing or NFKC, it can guarantee only `D(E(x)) = N(x)`, not reconstruction of the original string. “Every tokenizer is lossless” and “byte-level BPE can be designed to be lossless” are different claims.

### A tokenizer acts as a static compute-allocation mechanism

Suppose a passage contains `B` UTF-8 bytes and becomes `T` tokens. A common **sequence-shortening metric** is:

\[
\text{bytes/token}=B/T.
\]

A higher value usually means a shorter sequence. It is often called a compression ratio informally, but it is not an information-theoretic code length: it does not include vocabulary storage, code probabilities, or model loss. For a standard Transformer, the main attention cost grows with `T²`, while FFNs, the KV cache, and many position-wise operations grow linearly with `T`. During generation, every token is also an autoregressive step. The tokenizer therefore decides statically which spans of bytes receive one step of expensive model computation.

Increasing the vocabulary size `V` is not free. The embedding and output matrices contain roughly `O(Vd)` parameters, the softmax becomes more expensive, and the vocabulary may accumulate many low-frequency, poorly estimated embedding and output rows. The central tradeoff is:

> Small vocabulary, long sequence, fine granularity, often greater robustness to rare strings and spelling perturbations  ↔  Large vocabulary, short sequence, more rare rows, less direct access to within-token character structure.

---

## 2. Why not use characters, bytes, or words directly?

| Unit | Advantages | Main problems |
|---|---|---|
| Unicode code point | Intuitive; natural for many character-level tasks | A code point is not necessarily a user-perceived character; combining marks and emoji may use several code points, and the vocabulary is large |
| Grapheme cluster | Closer to what a reader perceives as a character | Segmentation rules are complex; long sequences and morphology remain unresolved |
| UTF-8 byte | Only 256 values, no OOV, covers arbitrary text | Non-ASCII characters often require several bytes; sequences are long and an individual byte has little meaning |
| Word | Short sequences and interpretable units | Vocabulary explosion, rare and unknown words, and no simple whitespace boundary for languages such as Chinese or Thai |
| Subword | A compromise between vocabulary size and sequence length | Static heuristic boundaries; characters inside a token are not directly visible; highly dependent on corpus, language, and domain |

This is why subword methods such as BPE, WordPiece, and Unigram exist: common strings can become one token, rare strings can fall back to smaller units, and the model still has a fixed vocabulary.

Three concepts are especially easy to conflate:

- **Byte-level BPE** starts from all 256 byte values and learns merges, so it has no OOV by construction.
- **Unicode subwords with byte fallback** normally operate on Unicode pieces and use byte tokens only for characters not otherwise covered.
- **SentencePiece** is a tokenizer framework, not one specific algorithm. It can train BPE or Unigram models and also handles normalization, whitespace representation, special tokens, byte fallback, and related pipeline concerns.

---

## 3. The full pipeline of a modern tokenizer

The Hugging Face [Tokenizers documentation](https://huggingface.co/docs/tokenizers/main/api/tokenizer) describes a tokenizer as a pipeline of components. A useful mental model for GPT-style byte-level BPE is:

```text
Unicode string
  ├─ optional normalization
  ├─ isolate explicitly allowed special tokens
  ├─ regex pre-tokenization
  ├─ encode every normal chunk as UTF-8 bytes
  ├─ apply ranked BPE merges inside each chunk
  ├─ map pieces to integer IDs
  └─ optional post-processing / BOS / EOS

IDs
  └─ token ID → bytes → concatenate → UTF-8 decode
```

The most frequently overlooked stage is **pre-tokenization**. A GPT-style regex first separates contractions, letters, numbers, punctuation, line breaks, and whitespace; BPE is then applied independently inside each chunk. As a result:

- a merge cannot cross a regex boundary;
- `hello` and ` hello` can be distinct tokens;
- grouping numbers by one, two, or three digits may be an explicit regex policy rather than something BPE discovered;
- an English-friendly regex may be a poor fit for Chinese, agglutinative languages, source code, or mathematical notation.

Karpathy's [minBPE exercise](https://github.com/karpathy/minbpe/blob/master/exercise.md) offers an excellent progression: implement `BasicTokenizer`, add `RegexTokenizer`, and finally reproduce the exact IDs emitted by `tiktoken`. Stanford CS336 [Assignment 1](https://github.com/stanford-cs336/assignment1-basics) likewise emphasizes pre-tokenization, special tokens, performance, and correctness.

The engineering conclusion is important:

> **The vocabulary, merge ranks, normalizer, pre-tokenizer regex, special-token table, and decoder jointly define the tokenizer model. They must be serialized and versioned together.**

---

## 4. BPE fundamentals: training and encoding are different operations

BPE began with Philip Gage's [1994 compression algorithm](http://www.pennelynn.com/Documents/CUJ/HTML/94HTML/19940045.HTM). [Sennrich et al. 2016](https://aclanthology.org/P16-1162/) adapted it to subwords for neural machine translation, and [§2.2 of the GPT-2 report](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf) popularized byte-level BPE for language models.

The GPT-2 reference implementation first maps the 256 byte values bijectively to printable Unicode symbols, then runs BPE over those symbols. This is a reversible implementation device, not natural-language segmentation over Unicode characters. `tiktoken` and the accompanying implementation in this article can instead store vocabulary entries directly as `bytes`. The concepts are equivalent, but their concrete byte mappings and ranks cannot be mixed when reproducing an existing model.

### 4.1 Training: repeatedly merge the most frequent adjacent pair

The simplest byte-level BPE training algorithm is:

1. Convert each pre-token to UTF-8 byte IDs.
2. Initialize the vocabulary with IDs `0..255`.
3. Count adjacent token pairs.
4. Select the most frequent pair `(a,b)`.
5. Create a new token `c = a + b` and record the rule `(a,b) → c`.
6. Replace non-overlapping occurrences of that pair in the corpus.
7. Repeat until the target vocabulary size is reached.

Training uses adjacent-pair frequency as a proxy for local sequence compression and makes a greedy choice. Counts may include overlapping pairs while replacements must be non-overlapping, so the highest raw count does not always identify the pair that would remove the most tokens in that round. BPE is not a globally optimal compressor, nor does it directly optimize semantic boundaries, downstream loss, fairness, or robustness.

This reliance on heuristics is not merely an implementation shortcut. [Tokenisation over Bounded Alphabets is Hard (ICLR 2026)](https://openreview.net/forum?id=Xhf9YqwlM4) shows that even over a binary alphabet, the corresponding optimal bottom-up merge and direct vocabulary-selection problems are NP-complete and APX-hard.

### 4.2 A hand-worked example: `aaabdaaabac`

This [minBPE README](https://github.com/karpathy/minbpe) example is ideal for working through by hand. IDs `0..255` are already reserved for bytes. With three merges:

| Step | New rule | Symbolic sequence |
|---|---|---|
| Initial | — | `a a a b d a a a b a c` |
| 1 | `(a,a) → 256`, representing `aa` | `256 a b d 256 a b a c` |
| 2 | `(256,a) → 257`, representing `aaa` | `257 b d 257 b a c` |
| 3 | `(257,b) → 258`, representing `aaab` | `258 d 258 a c` |

The resulting encoding is:

```python
[258, 100, 258, 97, 99]
```

Two implementation details matter:

- In `aaa`, the pair `(a,a)` has two overlapping positions, but a left-to-right non-overlapping replacement can merge it only once.
- Ties between equally frequent pairs require an explicit deterministic policy. The table and companion script follow the CS336 rule: choose the lexicographically larger tuple of token byte strings. On the second merge, another tie-break could choose `ab` and still produce the same final IDs, which is why asserting only the final output does not verify the internal merge tree.

### 4.3 Encoding: replay learned rules by rank

When encoding new text, **do not recount the most frequent pair in that input**. Instead:

1. Begin with byte IDs.
2. Find adjacent pairs that occur in the merge table.
3. Select the pair with the smallest rank—the rule learned earliest during training.
4. Merge its non-overlapping occurrences.
5. Continue until no rule applies.

The BPE model is therefore not just an `id → bytes` vocabulary. **Merge order is also a model parameter.**

### 4.4 Decoding: concatenate bytes before decoding UTF-8

```python
text = b"".join(vocab[token_id] for token_id in ids).decode("utf-8")
```

The bytes of one token need not form valid UTF-8; a Chinese character or emoji may span several tokens. Always concatenate the full byte sequence before decoding. `errors="replace"` can display an arbitrary invalid ID sequence, but that visualization is lossy—the resulting `�` must never be used to reconstruct vocabulary bytes.

---

## 5. Implementing a working byte-level BPE tokenizer from scratch

The single-file teaching implementation and basic self-checks are in [tokenization_bpe_from_scratch.py](./tokenization_bpe_from_scratch.py). Its only non-standard dependency is `regex`:

```bash
pip install regex
python tokenization_bpe_from_scratch.py
```

One API difference is worth noting. The target `vocab_size` in CS336 includes the 256 byte tokens, special tokens, and learned merge tokens. For clarity, the companion script accepts `num_merges` directly and assigns special IDs after the merge IDs. When adapting it to the assignment interface, use `num_merges = vocab_size - 256 - len(special_tokens)`, while remembering that training may stop early if no mergeable pair remains.

The core training loop is below. The complete file also implements regex pre-tokenization, special-token handling, a stable tie-break, and decoding:

```python
vocab = {i: bytes([i]) for i in range(256)}
ordered_merges = []

for _ in range(num_merges):
    pair_counts = Counter()
    for ids, frequency in piece_counts.items():
        for pair in zip(ids, ids[1:]):
            pair_counts[pair] += frequency

    if not pair_counts:
        break

    pair = max(
        pair_counts,
        key=lambda p: (pair_counts[p], vocab[p[0]], vocab[p[1]]),
    )
    new_id = len(vocab)
    vocab[new_id] = vocab[pair[0]] + vocab[pair[1]]
    ordered_merges.append((pair, new_id))

    updated = Counter()
    for ids, frequency in piece_counts.items():
        updated[merge_pair(ids, pair, new_id)] += frequency
    piece_counts = updated
```

The following simplified pseudocode considers only merge rules present in the current sequence:

```python
while len(ids) >= 2:
    candidates = {
        pair for pair in zip(ids, ids[1:]) if pair in rule_by_pair
    }
    if not candidates:
        break
    pair = min(candidates, key=lambda p: rule_by_pair[p].rank)
    ids = merge_pair(ids, pair, rule_by_pair[pair].new_id)
```

The companion script stores each rule internally as a `(rank, new_id)` tuple; the named fields above are used only to make the pseudocode easier to read.

### From basic self-checks to a complete test suite

```python
assert decode(encode(text)) == text
```

The companion script checks the toy merge tree and IDs, the empty string, regex boundaries, multilingual and emoji round trips, ordinary/allowed/unknown special-token behavior, and strict decoding of a partial UTF-8 token. A production implementation should additionally cover:

- empty input, repeated strings such as `aaa`, whitespace, line breaks, and control characters;
- Chinese, Korean, combining marks, emoji, and mixed scripts;
- allowed, ordinary-literal, and reject policies for special-token strings;
- deterministic pair-frequency tie-breaking;
- proof that merges never cross regex boundaries;
- exact golden token IDs from the target implementation, such as `tiktoken`;
- stable serialization, loading, and artifact hashes;
- tokens that are individually invalid UTF-8 but valid after concatenation.

The script intentionally accepts only Python strings that can be encoded as strict UTF-8. A production API must also define what happens to lone surrogates or directly supplied invalid byte sequences: reject, replace, or preserve them. The choice changes the exact byte-level round-trip contract.

Only `decode(encode(text)) == text` is guaranteed. For an arbitrary hand-constructed, non-canonical ID sequence, `encode(decode(ids))` need not reproduce the same IDs.

### Special tokens are control-plane data, not ordinary vocabulary

`<|endoftext|>`, BOS, EOS, role delimiters, and tool delimiters should occupy a separate special-token namespace. Parsing them must require explicit permission; otherwise, a reserved string inside user-controlled text can silently become a control instruction. Both minBPE and `tiktoken` expose an explicit `allowed_special` choice. This is a security boundary, not decorative API design.

“Not allowed” still requires a concrete policy. The companion script encodes a reserved string as ordinary bytes, similar to `encode_ordinary`; `tiktoken.encode` rejects a known but unallowed special string by default. Either policy can be reasonable. The important requirements are that user text must never be silently interpreted as a control token and that callers and tests know which policy is active.

---

## 6. From teaching code to a CS336-grade implementation

The simple trainer rescans the entire corpus after every merge, giving roughly `O(number_of_merges × corpus_length)` work. That is ideal for learning and poor for large-scale training. Production implementations typically:

- collapse repeated pre-tokens into `piece → frequency` and weight pair counts by occurrence frequency;
- represent token occurrences with adjacency structures and update only pairs affected by a merge;
- use a heap or priority queue for high-frequency candidates while handling stale entries;
- parallelize pre-tokenization and local counting, then reduce counters globally;
- cut shards only at document or special-token boundaries, never at an arbitrary point inside UTF-8 or a regex chunk;
- use Rust or C++, caching, batching, and vectorization for inference;
- attach versions, hashes, normalization metadata, and compatibility tests to the tokenizer artifact.

The CS336 Lecture 1 implementation intentionally scans every merge rule. The assignment asks students to consider only currently relevant merges, preserve special tokens, use GPT-style pre-tokenization, and make the implementation as fast as practical. Karpathy's later [nanochat tokenizer](https://github.com/karpathy/nanochat/blob/master/nanochat/tokenizer.py) likewise moves from readable Python minBPE to Rust training and `tiktoken.Encoding` inference, and evaluates compression separately on news, code, mathematics, science, Korean, and other slices.

### Do not cargo-cult a frontier model's regex

Karpathy's GPT-4 reproduction exercise uses `\p{N}{1,3}`, while versions of the nanochat experiments selected `\p{N}{1,2}` for their own setup. This is exactly the point: digit grouping, vocabulary size, and data distribution must be designed together. “Three digits per chunk” is not a law of nature.

---

## 7. BPE, WordPiece, and Unigram

| Method | How the vocabulary is built | How inference segments text | Typical properties |
|---|---|---|---|
| BPE | Start small and repeatedly merge frequent adjacent pairs | Replay merges by rank | Simple, fast, strong sequence compression; greedy and static |
| WordPiece | Historical implementations vary; common descriptions use frequency- or likelihood-gain-style vocabulary construction | Greedy longest-match-first / MaxMatch | Common in BERT-family models; may emit `[UNK]` without byte fallback |
| Unigram LM | Start with a large candidate vocabulary, then remove pieces using a probabilistic model, EM, and loss-based pruning | Viterbi for the best segmentation, or posterior sampling | Naturally supports multiple segmentations and subword regularization |
| SentencePiece | Not a separate algorithm; wraps BPE/Unigram plus the text pipeline | Depends on the selected model | Trains directly on raw sentences, often represents space with `▁`, and can provide byte fallback |

The WordPiece row is a conceptual summary, not a recipe for reproducing an arbitrary BERT tokenizer. Historical training details differ across codebases; exact compatibility still requires the original vocabulary, normalizer, pre-tokenizer, and implementation-level tests.

The key insight in [Kudo 2018](https://aclanthology.org/P18-1007/) is that one string admits many valid segmentations, and sampling several of them during training can serve as regularization. [BPE-Dropout](https://aclanthology.org/2020.acl-main.170/) obtains a similar effect by randomly skipping BPE merges.

For a deeper look at WordPiece inference, [Fast WordPiece Tokenization](https://aclanthology.org/2021.emnlp-main.160/) uses a trie with failure links to implement longest-match-first in strict linear time. For a recent and particularly clear simplified Unigram implementation, see [Which Pieces Does Unigram Tokenization Really Need? (Findings ACL 2026)](https://aclanthology.org/2026.findings-acl.316/).

---

## 8. The central problems with fixed tokenization

### 8.1 Characters inside a token are not directly visible to the main model

The model receives one embedding ID, not a short sequence of the characters inside that token. It can learn token spellings indirectly from data, but that knowledge may not compose reliably for letter counting, string reversal, rhyme, or editing.

Karpathy emphasizes this issue with spelling and string-manipulation examples. [CUTE (EMNLP 2024)](https://aclanthology.org/2024.emnlp-main.177/) provides more systematic evidence: models appear to know the spelling of many tokens but often fail to use that information reliably in character-level operations.

Not every failure on a character task should be blamed on the tokenizer. Model scale, data, positional mechanisms, and task difficulty matter too. The precise claim is that **fixed subword tokens impose an unfavorable inductive bias on character-level tasks.**

### 8.2 Digit grouping imposes an arbitrary coordinate system on arithmetic

The strings `127`, `677`, and `8041` may be divided into unrelated groups of one to three digits. Before performing arithmetic, the model must recover decimal place structure from these irregular token boundaries. [Tokenization Counts](https://arxiv.org/abs/2402.14903) finds that forcing right-aligned number grouping can substantially change GPT-3.5/4 arithmetic performance and error patterns.

The conclusion is not that tokenization is the only cause of arithmetic failure. Rather, **number granularity and alignment determine the coordinate system in which the model must learn an algorithm.**

### 8.3 A one-character typo can trigger a discontinuous retokenization

In a character representation, a typo changes one position. Under subword tokenization, the same typo may turn one common token into several rare fragments, changing both the embeddings and the sequence length. [Tokenization Falling Short](https://aclanthology.org/2024.findings-emnlp.86/) reports that scaling the model mitigates but does not eliminate biases associated with typos, length variation, and within-token structure; training with alternative segmentations such as BPE-dropout can improve some forms of robustness.

Unicode confusables, zero-width characters, combining-mark order, and normalization can also create inputs that look identical but produce different IDs. Security filters, user-visible logs, and the byte stream sent to the model must agree.

### 8.4 Cross-lingual inequity: the same content can carry very different token costs

When a tokenizer allocates more vocabulary capacity to high-resource languages, low-resource languages are often segmented more finely. This can lead to:

- higher API prices when billing is token-based and potentially higher serving latency;
- less effective content in a fixed token context window;
- fewer source bytes covered by the same training-token budget;
- longer dependency paths and, in some settings, lower task quality.

On parallel text, languages can require dramatically different numbers of tokens to express approximately the same content. [Petrov et al., NeurIPS 2023](https://proceedings.neurips.cc/paper_files/paper/2023/hash/74bb24dca8334adce292883b4b651eda-Abstract-Conference.html) report disparities of up to roughly 15× among tested language pairs; even character- and byte-level representations exceed 4× for some pairs. These are maxima in the study, not universal constants. [Ahia et al., EMNLP 2023](https://aclanthology.org/2023.emnlp-main.614/) connect such disparities to token-billed API cost, regional affordability, and task utility.

Byte-level modeling is not automatically fair. UTF-8 has writing-system-dependent byte overhead, and translations can differ intrinsically in orthography, morphology, and expression length. For languages without whitespace-delimited words, `tokens/word` also depends on an external segmenter. A fairness audit should therefore report several measures: token-length ratios on parallel text, tokens per extended grapheme cluster, bytes per token, latency, context occupancy, and downstream quality. A cost Gini, when used, is a Gini coefficient over per-language token costs.

### 8.5 Data and domain shifts make a vocabulary stale

A tokenizer trained on English web pages may handle code indentation, scientific notation, DNA, medical terminology, or another language poorly. A second failure mode appears when a string was frequent during tokenizer training but nearly absent after the LM corpus was cleaned. Its embedding receives little training and may become a so-called glitch token.

[Getting the most out of your tokenizer](https://arxiv.org/abs/2402.01035) studies how vocabulary size, regex design, and training data affect code-model generation speed, effective context, memory, and downstream performance. In practice, a tokenizer should be trained on a sample close to the final LM data mixture and evaluated separately by language and domain.

A pretrained model cannot simply swap tokenizers. Token IDs are indices into the embedding table and output head. Changing the vocabulary requires remapping or initializing those rows and enough continued pretraining to teach their new semantics.

### 8.6 A single canonical encoding is brittle—and can become a safety blind spot

A deterministic encoder returns one canonical segmentation even though the vocabulary may admit many alternative token sequences that decode to the same bytes. For some strings, the number of such alternatives grows exponentially with length. Because decoding is many-to-one, the likelihood of `E(x)` is not generally the full likelihood of byte string `x`; the latter must marginalize over the token paths considered valid by the chosen semantics.

[Adversarial Tokenization (ACL 2025)](https://aclanthology.org/2025.acl-long.1012/) reports that alternative tokenizations of a malicious string can evade safety behavior trained primarily on canonical encodings. The attack generally requires control over token IDs or an internal retokenization path; an ordinary closed text API may not expose that interface. The broader lesson remains: a safety pipeline should not assume that a string has only one discrete representation.

### 8.7 Prompt boundaries can make token-level sampling differ from string-level conditioning

BPE encodings are generally not prefix-consistent: even when byte string `x` is a prefix of `xy`, `E(x)` need not be a token-sequence prefix of `E(xy)`. Sampling after `E(x)` conditions on a token boundary immediately after `x`; conditioning on byte prefix `x` does not. The standard interface therefore excludes paths in which a token covering the end of the prompt extends beyond that boundary. Trailing spaces, partial words, source code, Chinese text, and streaming input can expose the problem.

Token healing is a useful heuristic rather than an exact correction. [Sampling from Your Language Model One Byte at a Time (ICML 2026)](https://openreview.net/forum?id=COQV7D1dAW) uses online BPE and model logits to compute an exact next-byte distribution under the paper's validity semantics, without retraining the original autoregressive BPE model. This suggests an intermediate direction: even if a model remains token-based internally, it can expose a more principled byte-level sampling interface.

### 8.8 The tokenizer is not learned end to end

The conventional pipeline trains a tokenizer first, often on a separate corpus and a separate compression objective, freezes it permanently, and only then trains the much larger LM. The tokenizer does not know which boundaries are easy to predict, which matter for reasoning, or when context should change a boundary.

Architectures such as BLT and H-Net aim to align the formation of computational units with the amount of modeling work the input actually requires.

---

## 9. Is stronger compression always better?

Several research results appear to disagree, but they fit together:

- [Unpacking Tokenization (2024)](https://arxiv.org/abs/2403.06265) finds a correlation between sequence compression and downstream performance, especially for generation and smaller models.
- [Tokenization Is More Than Compression (EMNLP 2024)](https://aclanthology.org/2024.emnlp-main.40/) introduces PathPiece, which minimizes token count for a fixed vocabulary, but does not produce better downstream models. Pre-tokenization and vocabulary construction remain important.
- [Tokenizer Choice For LLM Training](https://arxiv.org/abs/2310.08754) trains multiple 2.6B-parameter models and finds that tokenizers significantly affect downstream performance and cost, while simple metrics such as fertility and parity do not always predict final quality. Here, fertility is the average number of tokens per word or reference unit; parity is a cross-language token-length or cost ratio.

The synthesis is:

> Sequence compression is a useful baseline, not a sufficient objective. Token-frequency balance, learnable boundaries, morphological and domain alignment, pre-tokenization policy, robustness, and cross-lingual fairness all matter.

### Why per-token perplexity is not comparable across tokenizers

A token carries a different amount of source-text information under each tokenizer. The denominator in per-token perplexity therefore changes, so the raw numbers are not directly comparable. A more useful metric is bits per byte:

\[
\operatorname{BPB}=
\frac{-\sum_i \log_2 p(t_i\mid t_{<i})}{N_{\text{bytes}}}.
\]

If the implementation accumulates natural-log losses, divide by `ln 2` before reporting bits. In the same way, “trained on 1T tokens” is not a tokenizer-independent amount of data; report source bytes, documents, the language mixture, and training FLOPs as well.

BPB is directly comparable only with the same raw-byte test corpus; identical or explicitly reconciled normalization; consistent document, BOS/EOS, special-token, masking, truncation, stride, and context accounting; and a clear statement of whether it is the usual teacher-forced canonical-path BPB or a marginalized string-level quantity. Controlled tokenizer experiments should also match the model, data, FLOPs, and optimization as closely as possible.

### A practical evaluation matrix

| Dimension | Suggested measurements |
|---|---|
| Reversibility | Exact byte-level round trip; randomized Unicode and byte fuzzing |
| Sequence compression | Bytes/token, characters/token, p50/p95 tokenized length |
| Vocabulary health | Token frequencies, dead or unreachable tokens, long-tail share, scaffold tokens |
| Cross-lingual fairness | Parallel-text token ratios, tokens/grapheme, per-language cost Gini |
| Modeling quality | BPB from small controlled LMs and downstream tasks |
| Robustness | Typos, whitespace, case, Unicode confusables, and code formatting |
| Systems | Training/encoding throughput, peak memory, prefill latency, decode latency |
| Safety | Special-token injection and canonical/non-canonical representation tests |

A **dead token** is present in the vocabulary but effectively absent from LM training. An **unreachable token** is never emitted by the canonical encoder. A **scaffold token** is mainly an intermediate node in a BPE merge hierarchy and is rarely emitted by itself.

---

## 10. Future directions: from fixed tokens to dynamic, hierarchical computation

### 10.1 Near term: design better static tokenizers

Static BPE remains a strong engineering baseline. Near-term improvements include:

- **Co-designing data, vocabulary size, and regex rules** instead of borrowing another model's tokenizer.
- **Training on multiple segmentations** through Unigram sampling or BPE-dropout.
- **Healthier vocabularies** that remove scaffold tokens used mainly as intermediate merge nodes.
- **Linguistic constraints** such as grapheme- or morphology-aware merges.
- **Fairness-aware objectives** that explicitly improve compression for the worst-served languages or reduce cross-language disparity.
- **Domain adaptation and tokenizer transfer** through continued BPE or hypernetworks that initialize embeddings for new tokens.

Representative 2026 work includes [Parity-Aware BPE](https://aclanthology.org/2026.acl-long.342/), [MorphBPE](https://aclanthology.org/2026.findings-acl.2068/), and [Teaching Old Tokenizers New Words](https://aclanthology.org/2026.findings-eacl.341/). The research focus is shifting from a single universal BPE recipe toward joint tokenizer/model/data design.

### 10.2 Medium term: keep a byte interface and compress inside the model

“Tokenizer-free” is best read as **without a fixed external subword vocabulary**. These models still need to shorten the effective byte sequence; they move chunking into the architecture.

| Work | Basic idea | What it addresses | Remaining difficulty |
|---|---|---|---|
| [CANINE](https://aclanthology.org/2022.tacl-1.5/) | Character input, downsampling, then a deep encoder | Open vocabulary and multilingual encoding | Primarily an encoder-only path |
| [ByT5](https://aclanthology.org/2022.tacl-1.17/) | A 256-value UTF-8 byte alphabet plus special/sentinel IDs | No OOV and stronger noise/spelling robustness | Long sequences and slow byte-wise generation |
| [MEGABYTE](https://arxiv.org/abs/2305.07185) | Fixed-length byte patches with local and global models | Shorter global sequences and very long byte contexts | Fixed patches ignore boundaries and information density |
| [MambaByte](https://arxiv.org/abs/2401.13660) | Byte input with a linear state-space model | Makes long byte sequences more tractable | Many output steps; evidence remains scale- and task-dependent |
| [SpaceByte](https://arxiv.org/abs/2404.14408) | Invoke larger blocks after spaces and similar boundaries | Concentrates compute near plausible word boundaries | Does not generalize naturally to languages without spaces or other modalities |
| [BLT](https://arxiv.org/abs/2412.09871) | Next-byte entropy determines variable patches; local encoder/decoder plus a latent Transformer | Long patches in predictable regions, finer units in complex regions | The entropy patcher is separately trained; serving is more complex |
| [H-Net](https://arxiv.org/abs/2507.07955) | Jointly learned, recursive dynamic chunking | Context-dependent end-to-end boundaries; larger gains on Chinese, code, and similar domains in reported experiments | Training, kernels, batching, caching, and frontier-scale deployment remain immature |
| [Fast BLT (ICML 2026)](https://openreview.net/forum?id=mo6rHb1z82) | Block diffusion, multi-byte draft/verification, and self-speculation | Parallel byte generation and lower estimated memory-bandwidth cost | Quality–parallelism tradeoffs and real end-to-end hardware gains require broader validation |

### 10.3 The key architectural contrast: BLT versus H-Net

**BLT (Byte Latent Transformer)** uses a small, separately trained next-byte model to estimate entropy and opens a new patch in difficult-to-predict regions. Lightweight local modules aggregate bytes into patches and decode them, while the expensive latent Transformer operates only over the patch sequence. The paper reports a FLOP-controlled study up to 8B parameters and 4T training bytes, performance comparable to token-based baselines in its settings, stronger noise and long-tail robustness, and a new tradeoff between longer patches and a larger main model.

BLT is not fully jointly end to end: its patch boundaries come from an external entropy model.

**H-Net (2025 arXiv; ICLR 2026)** lets contextual hidden states determine boundaries jointly with the main sequence-modeling objective, using differentiable approximations and a downsampling loss. H-Net stages can be nested recursively, learning a hierarchy from bytes to subword-like chunks and then higher-level chunks. The paper reports that a one-stage H-Net can outperform a strong compute- and data-matched BPE Transformer, while deeper hierarchies match larger token-based models and show larger gains on Chinese, code, and DNA.

The conceptual shift matters more than any one benchmark:

> BPE fixes boundaries from global frequency statistics; BLT allocates variable patches using local predictability; H-Net learns context-dependent boundaries jointly with the language-modeling objective.

Fast BLT then targets the remaining decoding bottleneck with block diffusion and draft/verify variants. Its reported memory-bandwidth estimates should not be confused with universally measured wall-clock speedups.

### 10.4 Open questions

1. Will learned boundaries reproduce the same cross-lingual disparities from imbalanced training data?
2. Byte models remove OOV but still inherit writing-system-dependent UTF-8 overhead.
3. Do lower FLOP counts translate into lower wall-clock latency, good GPU utilization, and higher throughput?
4. How should dynamic patches interact with batch packing, the KV cache, prompt caching, quantization, and speculative decoding?
5. Fast BLT and token-draft/byte-verify methods have begun to parallelize byte output. Can they preserve quality and the intended distribution while delivering real hardware gains?
6. How can new tokenization schemes remain compatible with existing embeddings, output heads, safety training, and tooling?
7. Fairness, sequence compression, linguistic alignment, robustness, and downstream quality are partly independent and often in tension. How should the system optimize them jointly?

As of 2026, BPE is not obsolete. A more defensible conclusion is:

> **Static subword tokenization will remain a cheap and mature default, while frontier research builds dynamic, multiscale, learnable computation over raw bytes.**

This is consistent with the summary in CS336 Lecture 1: a model still needs chunks or abstractions over a sequence, but those chunks should be variable so that more capacity is allocated to more informative regions.

---

## 11. If you were training a tokenizer today

### 11.1 Before training

1. Decide whether you require an exact byte-for-byte round trip and whether lossy Unicode normalization is allowed.
2. Stratify samples from the final LM data mixture by language, domain, and format instead of training only on English web pages.
3. Decide whether the universal fallback is a byte, code point, grapheme cluster, or morpheme. Bytes provide a closed universal alphabet; grapheme and morpheme boundaries require language-sensitive machinery.
4. Define special tokens and their safe parsing policy early. Leave deliberate room for growth, but do not reserve a large set of tokens that the model will never train.

### 11.2 Run small controlled sweeps

Vary these choices jointly:

- vocabulary size;
- the pre-tokenization regex, especially digit, space, newline, and code-symbol policies;
- BPE versus Unigram, with or without sampling/dropout;
- language and domain weights in the tokenizer data mixture.

Do not simply choose the tokenizer with the highest bytes/token. Train several small, compute-matched LMs and use BPB, downstream tasks, and robustness as proxy evaluations.

### 11.3 Audit before freezing the artifact

- Report length distributions and worst-case slices by language and domain.
- Inspect the most frequent, least frequent, and longest tokens, including opaque byte tokens.
- Identify dead, unreachable, scaffold, and data-mismatch tokens.
- Fuzz Unicode, special-token strings, whitespace, and serialization.
- Benchmark CPU throughput, memory, and multiprocess determinism.
- Publish the normalizer, regex, merges, vocabulary, special-token table, version, and hash together.

Once large-scale LM training begins, the tokenizer becomes similar to an ABI: replacing it is not an ordinary preprocessing change because token IDs already address rows in the embedding table and output head.

---

## 12. An annotated reading path

### Stage 1: learn by implementing

1. [Stanford CS336 Lecture 1](https://github.com/stanford-cs336/lectures/blob/main/lecture_01.py): the tradeoffs among character, byte, word, and BPE tokenization, plus a minimal implementation.
2. [CS336 Assignment 1](https://github.com/stanford-cs336/assignment1-basics): turn the toy implementation into a tested, usable tokenizer.
3. [Karpathy's video](https://www.youtube.com/watch?v=zduSFxRajkE), [minBPE](https://github.com/karpathy/minbpe), and the [exercise](https://github.com/karpathy/minbpe/blob/master/exercise.md): the smoothest from-scratch implementation path. The written [lecture.md](https://github.com/karpathy/minbpe/blob/master/lecture.md) does not cover the full video.
4. [OpenAI tiktoken](https://github.com/openai/tiktoken): production byte-level BPE plus the `_educational` module.
5. [Hugging Face Tokenizers](https://huggingface.co/docs/tokenizers/main/api/tokenizer): the component pipeline of normalizer, pre-tokenizer, model, post-processor, and decoder.

### Stage 2: understand the classic algorithms

1. [Sennrich et al. 2016 — Neural Machine Translation of Rare Words with Subword Units](https://aclanthology.org/P16-1162/).
2. [Kudo 2018 — Subword Regularization](https://aclanthology.org/P18-1007/).
3. [SentencePiece, 2018](https://aclanthology.org/D18-2012/).
4. [BPE-Dropout, 2020](https://aclanthology.org/2020.acl-main.170/).
5. [Fast WordPiece Tokenization, 2021](https://aclanthology.org/2021.emnlp-main.160/).

### Stage 3: understand where tokenizers fail

1. [Language Model Tokenizers Introduce Unfairness Between Languages, 2023](https://proceedings.neurips.cc/paper_files/paper/2023/hash/74bb24dca8334adce292883b4b651eda-Abstract-Conference.html).
2. [Do All Languages Cost the Same?, 2023](https://aclanthology.org/2023.emnlp-main.614/).
3. [Tokenizer Choice For LLM Training: Negligible or Crucial?, 2023/2024](https://arxiv.org/abs/2310.08754).
4. [Tokenization Counts: the Impact of Tokenization on Arithmetic in Frontier LLMs, 2024](https://arxiv.org/abs/2402.14903).
5. [CUTE: Measuring LLMs' Understanding of Their Tokens, 2024](https://aclanthology.org/2024.emnlp-main.177/).
6. [Tokenization Falling Short: On Subword Robustness in Large Language Models, 2024](https://aclanthology.org/2024.findings-emnlp.86/).
7. [Tokenization Is More Than Compression, 2024](https://aclanthology.org/2024.emnlp-main.40/).
8. [Adversarial Tokenization, 2025](https://aclanthology.org/2025.acl-long.1012/).
9. [Stop Taking Tokenizers for Granted: They Are Core Design Decisions in Large Language Models, EACL 2026](https://aclanthology.org/2026.eacl-long.394/): a case for tokenizer/model co-design, standardized evaluation, and transparent reporting.

### Stage 4: follow the tokenizer-free and latent-tokenization frontier

1. [CANINE, TACL 2022](https://aclanthology.org/2022.tacl-1.5/) and [ByT5, TACL 2022](https://aclanthology.org/2022.tacl-1.17/): foundational evidence for character- and byte-level modeling.
2. [MEGABYTE, 2023](https://arxiv.org/abs/2305.07185): fixed local/global byte patches.
3. [MambaByte, 2024](https://arxiv.org/abs/2401.13660): using a linear sequence architecture to handle bytes.
4. [SpaceByte, 2024](https://arxiv.org/abs/2404.14408): simple boundary-triggered global computation.
5. [Byte Latent Transformer, 2024](https://arxiv.org/abs/2412.09871): entropy-based variable patches and large-scale byte modeling.
6. [H-Net, 2025 / ICLR 2026](https://arxiv.org/abs/2507.07955): jointly learned, recursive dynamic chunking.
7. [Fast Byte Latent Transformer, ICML 2026](https://openreview.net/forum?id=mo6rHb1z82): block diffusion and multiple byte draft/verification paths.
8. [Sampling from Your Language Model One Byte at a Time, ICML 2026](https://openreview.net/forum?id=COQV7D1dAW): a correct byte-prefix sampling interface for an existing token-based autoregressive model without retraining.

---

## Conclusion

Thinking of tokens as “words” hides the problem. Thinking of them as a **discrete interface, a sequence-compression device, and a unit of compute allocation** connects the major observations:

- BPE works because it is a cheap, reversible, data-driven heuristic for shortening sequences.
- BPE behaves strangely because it optimizes frequency—not semantics, arithmetic, spelling, fairness, or downstream loss.
- A tokenizer cannot be swapped casually because token IDs already index learned model parameters.
- Bytes are attractive and expensive for the same reason: they eliminate OOV and a fixed subword vocabulary, but lengthen both sequences and generation.
- BLT and H-Net matter because they do not abandon chunks; they try to make chunks reflect how much computation the model should spend at a particular point.

The most useful final mental model is:

> **Today's tokenizer sits outside the model and fixes boundaries in advance from global corpus statistics. Future systems are more likely to begin with a reversible byte interface and form dynamic, hierarchical units of computation inside the model, conditioned on content, context, and predictive difficulty.**
