import SimpleController from './SimpleController'


export default class Home extends SimpleController {
  public method: Method = 'get'
  public override pattern: string = '/'
  async handler(ctx: MyAppContext) {
    ctx.body = 'Hello World!'
  }
}
