/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
    options: {
        doNotFollow: {
            dependencyTypes: [
                'npm',
                'npm-dev',
                'npm-optional',
                'npm-peer',
                'npm-bundled',
                'npm-no-pkg',
            ],
        },

        includeOnly: '^src',

        tsPreCompilationDeps: false,

        /* How to resolve external modules - use "yarn-pnp" if you're using yarn's Plug'n'Play.
           otherwise leave it out (or set to the default, which is 'node_modules')
           externalModuleResolutionStrategy: 'yarn-pnp',
        */

        progress: { type: 'performance-log' },

        reporterOptions: {
            archi: {
                collapsePattern:
                    '^src/components/core/api/[^/]+|^src/components/features/[^/]+|^src/components/shared/[^/]+|^src/components/utils/[^/]+',

                theme: {
                    modules: [
                        { criteria: { source: '^src/components/core/api' }, attributes: { fillcolor: '#FF5733' } },
                        { criteria: { source: '^src/components/core/contexts' }, attributes: { fillcolor: '#33FF57' } },
                        { criteria: { source: '^src/components/core/environments' }, attributes: { fillcolor: '#5733FF' } },
                        { criteria: { source: '^src/components/core/guards' }, attributes: { fillcolor: '#FFD633' } },
                        { criteria: { source: '^src/components/core/hooks' }, attributes: { fillcolor: '#33C4FF' } },
                        { criteria: { source: '^src/components/features/about' }, attributes: { fillcolor: '#FF33C4' } },
                        { criteria: { source: '^src/components/features/comment' }, attributes: { fillcolor: '#33FFC4' } },
                        { criteria: { source: '^src/components/features/footer' }, attributes: { fillcolor: '#FF5733' } },
                        { criteria: { source: '^src/components/features/header' }, attributes: { fillcolor: '#33FF57' } },
                        { criteria: { source: '^src/components/features/home' }, attributes: { fillcolor: '#5733FF' } },
                        { criteria: { source: '^src/components/features/jokes' }, attributes: { fillcolor: '#FFD633' } },
                        { criteria: { source: '^src/components/features/not-found-404' }, attributes: { fillcolor: '#33C4FF' } },
                        { criteria: { source: '^src/components/features/rating' }, attributes: { fillcolor: '#FF33C4' } },
                        { criteria: { source: '^src/components/features/users' }, attributes: { fillcolor: '#33FFC4' } },
                        { criteria: { source: '^src/components/features/meme' }, attributes: { fillcolor: '#FF5733' } },
                        { criteria: { source: '^src/components/shared/infinite-scroll' }, attributes: { fillcolor: '#33FF57' } },
                        { criteria: { source: '^src/components/shared/loader' }, attributes: { fillcolor: '#5733FF' } },
                        { criteria: { source: '^src/components/shared/messages' }, attributes: { fillcolor: '#FFD633' } },
                        { criteria: { source: '^src/components/shared/no-content' }, attributes: { fillcolor: '#33C4FF' } },
                        { criteria: { source: '^src/components/shared/scroll-to-top-button' }, attributes: { fillcolor: '#FF33C4' } },
                        { criteria: { source: '^src/components/utils' }, attributes: { fillcolor: '#33FFC4' } },
                    ],
                    graph: {
                        splines: 'ortho',
                        rankdir: 'TB',
                        ranksep: '1',
                    },
                },
            },
        },
    },
};