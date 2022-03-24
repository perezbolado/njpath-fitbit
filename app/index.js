import document from "document";
import { Application } from './view'
import { MainView } from './main_view'
import { StationView } from './station_view'

class MultiScreenApp extends Application {
    // List all screens
    screens = { MainView, StationView }
}
// Start the application with Screen1.
MultiScreenApp.start( 'MainView' );