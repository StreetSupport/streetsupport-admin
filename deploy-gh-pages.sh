#!/bin/bash

# Define variables depending on the branch
if [[ $TRAVIS_BRANCH == 'master' ]]
  then
    REPO="github.com/StreetSupport/admin.streetsupport.net-live.git"
    DOMAIN="service.streetsupport.net"
    APIENVIRONMENT=2
  else
    REPO="github.com/StreetSupport/admin.streetsupport.net-dev.git"
    DOMAIN="dev-service.streetsupport.net"
    APIENVIRONMENT=1
fi

# Get the commit details
THE_COMMIT=`git rev-parse HEAD`

# Set git details
git config --global user.email "enquiry@streetsupport.net"
git config --global user.name "Travis CI"

# Delete _dist
rm -rf _dist
mkdir _dist

# Run tests
jasmine

# Set environment
cd src/js
rm env.js
cat > env.js << EOF
module.exports = $APIENVIRONMENT
EOF

echo "env file rewritten to:"
cat env.js

cd ../../

# Run gulp
gulp deploy --debug --production

# Move to created directory
cd _dist

echo "pushing to repo"

# Push to git by overriding previous commits
# IMPORTANT: Supress messages so nothing appears in logs

if [[ $TRAVIS_BRANCH == 'master' ]] # live
  then
    git init
    git add -A
    git commit -m "Travis CI automatic build for $THE_COMMIT"
    git push --force --quiet "https://${GH_TOKEN}@${REPO}" master > /dev/null 2>&1
fi


if [[ $TRAVIS_BRANCH == 'develop' ]] # dev
  then
    openssl aes-256-cbc -K $encrypted_516b0b657008_key -iv $encrypted_516b0b657008_iv -in travis-deploy-key.enc -out .\\travis-deploy-key -d
    rm deploy-key.enc # Don't need it anymore
    chmod 600 deploy-key
    mv deploy-key ~/.ssh/id_rsa

    git init

    git remote add deploy "travisdeploy@178.62.41.238:/usr/share/nginx/html/admin-staging.streetsupport.net"
    git config user.name "vincelee"
    git config user.email "travis-deploy@streetsupport.net"

    git add .
    git commit -m "Deploy"
    git push --force deploy master
fi
