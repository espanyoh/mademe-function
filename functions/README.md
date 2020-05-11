# Made Me - Firebase function

## Trigger when create new recipe to firestore

## How to run
```
# Set up firestore function configuration first
firebase functions:config:set elasticsearch.username="xxxx" elasticsearch.password="xxxx" elasticsearch.url="https://xxx:9243/"

# Deploy
firebase deploy --only functions
```