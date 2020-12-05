npm run build
npm run build
cd ../CUV-Backoffice
npm run build
cd ../cuv/dist
mkdir backoffice
cd ..
mv ../CUV-Backoffice/dist/* dist/backoffice
firebase deploy
rm .firebase/*