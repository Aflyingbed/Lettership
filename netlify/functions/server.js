const serverless = require('serverless-http');
const express = require('express');
const app = require('../../app');

module.exports.handler = serverless(app, {
  framework: 'express',
});
