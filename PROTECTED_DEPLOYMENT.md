# Protected deployment process

This project must not be deployed directly from unfinished work.

1. Confirm the current production site is working and create a dated rollback ZIP.
2. Create a branch from the verified production commit. Never develop directly on `main`.
3. Run `npm ci` and `npm run build` on the branch.
4. Publish the branch output to a preview/staging location, not the live domain.
5. Test the homepage, navigation, contact page, AI Solutions page, every industry route, forms, chatbot, responsive layout, and browser console.
6. Obtain explicit approval from the site owner.
7. Merge the approved branch into `main` and deploy the exact tested build.
8. Verify the production routes after deployment and retain the rollback ZIP.

Never upload a ZIP whose contents have not been compared with the tested build output.
