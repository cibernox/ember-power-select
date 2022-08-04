/* eslint-disable no-undef */
self.deprecationWorkflow = self.deprecationWorkflow || {};

self.deprecationWorkflow.config = {
  workflow: [
    { handler: 'silence', matchId: 'ember-views.partial' },
    { handler: 'silence', matchId: 'ember-string.htmlsafe-ishtmlsafe' },
  ],
};
