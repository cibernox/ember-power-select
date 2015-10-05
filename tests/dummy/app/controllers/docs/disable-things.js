import Ember from 'ember';

export default Ember.Controller.extend({
  names: ['Stefan', 'Miguel', 'Tomster', 'Pluto'],
  countries: [
    { name: 'United States'           },
    { name: 'Spain',  disabled: true  },
    { name: 'Portugal'                },
    { name: 'Russia'                  },
    { name: 'Latvia', disabled: true  },
    { name: 'Brazil'                  },
    { name: 'United Kingdom'          },
  ]
});