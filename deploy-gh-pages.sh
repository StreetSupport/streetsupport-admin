#!/bin/bash

# Define variables depending on the branch
if [[ $TRAVIS_BRANCH == 'master' ]]
  then
    REPO="github.com/StreetSupport/admin.streetsupport.net-beta.git"
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
"module exports = $APIENVIRONMENT"
EOF

# Run gulp
gulp deploy --debug --production

# Move to created directory
cd _dist

echo "creating cname file"

# Create CNAME file and populate with domain depending on branch
#cat > CNAME << EOF
#$DOMAIN
#EOF

echo "pushing to repo"

# Push to git by overriding previous commits
# IMPORTANT: Supress messages so nothing appears in logs

if [[ $TRAVIS_BRANCH == 'master' ]] || [[ $TRAVIS_BRANCH == 'develop' ]]
  then
    git init
    git add -A
    git commit -m "Travis CI automatic build for $THE_COMMIT"
    git push --force --quiet "https://${GH_TOKEN}@${REPO}" master:gh-pages > /dev/null 2>&1
  else
    echo "Not on master or develop branch so don't push the changes to GitHub Pages"
fi
