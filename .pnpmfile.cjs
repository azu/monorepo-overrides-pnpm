/**
 * ## Rule
 *
 * - Root package.json should define all versions of child packages
 * - Root package.json should force this version via pnpm.overrides
 * - Each child package should use `workspaces:*` version for dependencies
 *
 * ## Usage
 *
 * ### Install only specific package
 *
 * $ NO_ROOT_DEPENEDECIES=true pnpm install --config.dedupe-peer-dependents --filter=./packages/app-a
 *
 **/
const rootPkg = require('./package.json')
function readPackage(pkg, context) {
    // if the pkg is not root and rootPkg's overrides does not define the dependencies/peerDependencies/devDependencies, throw error
    if (pkg.name !== rootPkg.name && pkg.name.startsWith("@monorepo/")) {
        ["dependencies", "peerDependencies", "devDependencies"].forEach((depType) => {
                const deps = pkg[depType]
                if (deps) {
                    Object.entries(deps).forEach(([depName, depVersion]) => {
                            if (!rootPkg.pnpm.overrides[depName]) {
                                throw new Error(`The package "${depName}" is not defined in the root package.json
                        
- package.name: ${pkg.name}

# How to fix?

Run the following command in the root directory.

\`\`\`
npm pkg set '${depType}.${depName}'='${depVersion}'
npm pkg set 'pnpm.overrides.${depName}'='\$${depName}'
pnpm install
\`\`\`

It will add the package to the root package.json and force the version via "pnpm.overrides".

`)
                            }
                            // DO no use 具体的なバージョン
                            if (!depVersion.startsWith("workspace:")) {
                                throw new Error(`Should use "workspace:*" version for dependencies in workspace packages

- package.name: ${pkg.name}

# How to fix?

Run the following command in the root directory.

\`\`\`
npm --prefix=$(find . -name package.json | xargs grep -l "${pkg.name}" | xargs dirname) pkg set '${depType}.${depName}'='workspace:*'
pnpm install
\`\`\`

It changes the version to "workspace:*" in the package.json of the workspace package.

`)
                            
                            }
                            
                            
                        }
                    )
                }
            }
        )
        ;
    }
    // if the pkg is root, remove dependencies/peerDependencies/devDependencies
    if (process.env.NO_ROOT_DEPENEDECIES) {
        if (pkg.name === rootPkg.name) {
            ["dependencies", "peerDependencies", "devDependencies"].forEach((depType) => {
                delete pkg[depType]
            })
        }
    }
    return pkg
}

module.exports = {
    hooks: {
        readPackage
    }
}
