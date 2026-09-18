# Check real public entry points after the Jekyll build, without network access.
root = ARGV.fetch(0, '_site')
required = %w[
  index.html research/index.html blog/index.html misc/index.html
  posts/2026/07/tokenization/index.html posts/2026/08/optimizer/index.html
  files/cv.pdf assets/css/studio.css assets/js/studio.js
]
missing = required.reject { |path| File.file?(File.join(root, path)) && File.size?(File.join(root, path)) }
abort "Missing or empty published files: #{missing.join(', ')}" unless missing.empty?
puts "Verified #{required.length} published entry points."
