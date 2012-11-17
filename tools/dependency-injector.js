var fs = require('fs');

var pkg = fs.readFileSync(process.argv[2], 'utf-8');
pkg = JSON.parse(pkg);

var deps = fs.readFileSync(process.argv[3], 'utf-8');
deps = JSON.parse(deps);

for (var dep in deps) {
    pkg.dependencies[dep] = deps[dep];
}

fs.writeFileSync(process.argv[2], JSON.stringify(pkg), 'utf-8');