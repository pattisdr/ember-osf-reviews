import { computed } from '@ember/object';
import EmberRouter from '@ember/routing/router';
import config from './config/environment';

// Disable the reset scroll behaviour on transitions between the two given routes.
const SCROLL_RESET_DISABLED_ROUTES = ['preprints.provider.moderation', 'preprints.provider.settings'];

const Router = EmberRouter.extend({
    location: config.locationType,
    rootURL: config.rootURL,

    transitioningFrom: '',
    transitioningTo: '',

    disableResetScroll: computed('transitioningFrom', 'transitioningTo', function() {
        return SCROLL_RESET_DISABLED_ROUTES.includes(this.get('transitioningFrom')) &&
            SCROLL_RESET_DISABLED_ROUTES.includes(this.get('transitioningTo'));
    }),

    willTransition(oldInfos, newInfos) {
        this._super(...arguments);

        this.set('transitioningFrom', EmberRouter._routePath(oldInfos));
        this.set('transitioningTo', EmberRouter._routePath(newInfos));
    },

    didTransition() {
        this._super(...arguments);

        if (!this.get('disableResetScroll')) {
            window.scrollTo(0, 0);
        }
    },
});

Router.map(function() {
    this.route('page-not-found', { path: '/*bad_url' });

    this.route('preprints', function() {
        this.route('page-not-found', { path: '/' });
        this.route('provider', { path: ':provider_id' }, function() {
            this.route('setup');
            this.route('moderation', { path: '/' });
            this.route('settings');
            this.route('preprint-detail', { path: ':preprint_id' });
        });
    });
    this.route('dashboard');
    this.route('page-not-found');
    this.route('forbidden');
});

export default Router;
