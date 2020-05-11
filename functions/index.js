/* eslint-disable promise/always-return */
const functions = require('firebase-functions');
const _ = require('lodash');
const request = require('request-promise');

// exports.testEvent5 = functions.firestore
//   .document('/profiles/{profileId}/plans/{planId}/recipes/{recipeId}')
//   .onCreate((snap, context) => {
//     console.log('db write to :snap', snap);
//     console.log('db write to :snap.data()', snap.data());
//     console.log('db write to covid:recipeId:', context.params.recipeId);
//     console.log('db write to covid:profileId:', context.params.profileId);
//     console.log('db write to covid:planId:', context.params.planId);
//     return 'ok-done';
//   });

exports.removeRecipeIndex = functions.firestore
  .document('/covid/{recipeId}')
  .onDelete((snap, context) => {
    const note = snap.data();
    let recipeData = note;
    let recipeId = context.params.recipeId;
    let elasticsearchFields = ['title', 'description'];
    let elasticSearchConfig = functions.config().elasticsearch;
    let elasticSearchUrl = elasticSearchConfig.url + 'temp/recipes/' + recipeId;

    let elasticsearchRequest = {
      method: 'DELETE',
      uri: elasticSearchUrl,
      auth: {
        username: elasticSearchConfig.username,
        password: elasticSearchConfig.password,
      },
    };

    return request(elasticsearchRequest).then((response) => {
      console.log('Elasticsearch response', response);
    });
  });

exports.createRecipeIndex = functions.firestore
  .document('/covid/{recipeId}')
  .onCreate((snap, context) => {
    const note = snap.data();
    let recipeData = note;
    let recipeId = context.params.recipeId;

    // console.log('Indexing recipe ', recipeId, recipeData);

    let elasticsearchFields = ['title', 'description'];
    let elasticSearchConfig = functions.config().elasticsearch;
    let elasticSearchUrl = elasticSearchConfig.url + 'temp/recipes/' + recipeId;
    // let elasticSearchMethod = recipeData ? 'POST' : 'DELETE';

    // console.log('elasticSearchConfig: ', elasticSearchConfig);
    // console.log('elasticSearchUrl: ', elasticSearchUrl);
    // console.log('elasticSearchConfig.username: ', elasticSearchConfig.username);
    // console.log('elasticSearchConfig.username: ', elasticSearchConfig.password);

    let elasticsearchRequest = {
      method: 'POST',
      uri: elasticSearchUrl,
      auth: {
        username: elasticSearchConfig.username,
        password: elasticSearchConfig.password,
      },
      body: _.pick(recipeData, elasticsearchFields),
      json: true,
    };

    return request(elasticsearchRequest).then((response) => {
      console.log('Elasticsearch response', response);
    });
  });
