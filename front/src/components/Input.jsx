class App extends Component {
    constructor() {
      super()
      this.title = React.createRef()
    }
    render() {
      return (
        <div className="App">
          <h1 ref = { this.title }>Hola comunidad</h1>
        </div>
      );
    }
  }