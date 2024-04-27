const rootPkg = require('./package.json')

function readPackage(pkg, context) {
    // if the pkg is not root and rootPkg's overrides does not define the dependencies/peerDependencies/devDependencies, throw error
    if (pkg.name !== rootPkg.name && pkg.name.startsWith("@newmo/")) {
        ["dependencies", "peerDependencies", "devDependencies"].forEach((depType) => {
            const deps = pkg[depType]
            if (deps) {
                Object.entries(deps).forEach(([depName, depVersion]) => {
                    if (!rootPkg.pnpm.overrides[depName]) {
                        throw new Error(`The package "${depName}" is not defined in the root package.json
                        
package.name: ${pkg.name}

# How to fix?

\`\`\`
npm pkg set '${depType}.${depName}'='${depVersion}'
npm pkg set 'pnpm.overrides.${depName}'='\$${depName}'
pnpm install
\`\`\`

`)
                    }
                })
            }
        });
    }
    // if the pkg is root, remove dependencies/peerDependencies/devDependencies
    if (pkg.name === rootPkg.name) {
        // ["dependencies", "peerDependencies", "devDependencies"].forEach((depType) => {
        //     delete pkg[depType]
        // })
    }
    return pkg
}

module.exports = {
    hooks: {
        readPackage
    }
}
