/* eslint-disable promise/always-return */
const functions = require('firebase-functions');
const _ = require('lodash');
const request = require('request-promise');

exports.removeRecipeIndex = functions.firestore
  .document('/recipes/{recipeId}')
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
  .document('/recipes/{recipeId}')
  .onCreate((snap, context) => {
    const note = snap.data();
    let recipeData = note;
    let recipeId = context.params.recipeId;

    let elasticsearchFields = ['title', 'description'];
    let elasticSearchConfig = functions.config().elasticsearch;
    let elasticSearchUrl = elasticSearchConfig.url + 'temp/recipes/' + recipeId;

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
