const rootPkg = require('./package.json')

function readPackage(pkg, context) {
    // if the pkg is not root and rootPkg's overrides does not define the dependencies/peerDependencies/devDependencies, throw error
    if (pkg.name !== rootPkg.name && pkg.name.startsWith("@monorepo/")) {
        ["dependencies", "peerDependencies", "devDependencies"].forEach((depType) => {
            const deps = pkg[depType]
            if (deps) {
                Object.keys(deps).forEach((dep) => {
                    if (!rootPkg.pnpm.overrides[dep]) {
                        throw new Error(`The package "${dep}" is not defined in the root package.json

# How to fix?

1. Add the "${dep}" to the root package.json's ${depType}
2. Add the "${dep}" to the root package.json's pnpm.overrides
2. Change the "${dep}" version to "*" on each package.json file
3. pnpm install

`)
                    }
                })
            }
        })
    }
    // if the pkg is root, remove dependencies/peerDependencies/devDependencies
    if (pkg.name === rootPkg.name) {
        ["dependencies", "peerDependencies", "devDependencies"].forEach((depType) => {
            delete pkg[depType]
        })
    }
    return pkg
}

module.exports = {
    hooks: {
        readPackage
    }
}
