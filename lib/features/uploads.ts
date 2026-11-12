// File uploads need Firebase Storage, which isn't turned on for this project
// (it's on the free Spark plan). While this is false, the three features that
// upload files are hidden everywhere - menus, home pages, search, My Progress,
// tour text - and their pages send visitors back to the section's home:
//   - Scholarships → Document vault      (/account/scholarships/vault)
//   - Study Abroad → Document vault      (/account/study-abroad/vault)
//   - Study Abroad → reviews: "Upload a document" as proof (university email still works)
// To bring them back: upgrade Firebase to Blaze, turn on Storage, deploy
// storage.rules (`firebase deploy --only storage`), then set this to true.
export const UPLOADS_ENABLED = false;
