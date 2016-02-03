
import {Component, View, bind} from 'angular2/core';
import {ROUTER_PROVIDERS, RouterOutlet, RouteConfig, RouterLink, Location} from 'angular2/router';

import {LocationStrategy, HashLocationStrategy} from 'angular2/router';

import { Todo } from './todo/todo';
import { About } from './about/about';

@Component({
	selector: 'my-app'
})
@View({
	templateUrl: 'app/components/app.html',
	directives: [RouterOutlet, RouterLink]
})
@RouteConfig([
	{ path: '/', component: Todo, as: 'Home' },
	{ path: '/about/:id', component: About, as: 'About' }
])
export class AppComponent {
    location: Location;
    constructor(location: Location) {
        this.location = location;
    }

    isActive(path) {
        return this.location.path() === path;
    }
}