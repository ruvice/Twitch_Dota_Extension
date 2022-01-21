import React from 'react'
import Authentication from '../../util/Authentication/Authentication'

import './Config.css'

export default class ConfigPage extends React.Component{
    constructor(props){
        super(props)
        this.Authentication = new Authentication()

        //if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null. 
        this.twitch = window.Twitch ? window.Twitch.ext : null
        this.state={
            finishedLoading:false,
            theme:'light',
            inputValue: '',
            accountId: '',
        }
    }

    contextUpdate(context, delta){
        if(delta.includes('theme')){
            this.setState(()=>{
                return {theme:context.theme}
            })
        }
    }

    componentDidMount(){
        // do config page setup as needed here
        if(this.twitch){
            this.twitch.onAuthorized((auth)=>{
                this.Authentication.setToken(auth.token, auth.userId)
                if(!this.state.finishedLoading){
                    // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.
    
                    // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
                    this.setState(()=>{
                        return {finishedLoading:true}
                    })
                }
            })
    
            this.twitch.onContext((context,delta)=>{
                this.contextUpdate(context,delta)
            })

            this.twitch.configuration.onChanged(() => {
                if (this.twitch.configuration.broadcaster) {
                    try {
                        // Parsing the array saved in broadcaster content
                        var accountId = this.twitch.configuration.broadcaster.content;
                        this.setState({ accountId: accountId })
                      } catch (e) {
                        console.log('Invalid config');
                      }
                }
            })
        }
    }

    updateInputValue(event){
        this.setState({
            inputValue: event.target.value
        });
    }

    startHeroVote(){
        fetch(`https://twitch-dota-extension-backend.herokuapp.com/initvote/hero`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                streamerId: this.state.accountId,
            })
        });
    }

    stopHeroVote(){
        fetch(`https://twitch-dota-extension-backend.herokuapp.com/stopvote/hero`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                streamerId: this.state.accountId,
            })
        });
    }

    render(){
        if(this.state.finishedLoading && this.Authentication.isModerator()){
            return(
                <div className="Config">
                    <div className={this.state.theme==='light' ? 'Config-light' : 'Config-dark'}>
                        <p className={this.state.theme==='light' ? 'Config-light' : 'Config-dark'}>Update your Dota Account Id, reopen configuration page to see change</p>
                        <input value={this.state.inputValue} onChange={event => this.updateInputValue(event)}/>
                        <button onClick={() => this.twitch.configuration.set('broadcaster', '1', this.state.inputValue)}>Update</button>
                        <p className={this.state.theme==='light' ? 'Config-light' : 'Config-dark'}>Current ID: {this.state.accountId}</p>
                        <button onClick={() => this.startHeroVote()}>Start Hero Vote</button>
                        <button onClick={() => this.stopHeroVote()}>Stop Hero Vote</button>
                    </div>
                </div>
            )
        }
        else{
            return(
                <div className="Config">
                    <div className={this.state.theme==='light' ? 'Config-light' : 'Config-dark'}>
                    <p className={this.state.theme==='light' ? 'Config-light' : 'Config-dark'}>Update your Dota Account Id, reopen configuration page to see change</p>
                        <input value={this.state.inputValue} onChange={event => this.updateInputValue(event)}/>
                        <button onClick={() => this.twitch.configuration.set('broadcaster', '1', this.state.inputValue)}>Update</button>
                        <p className={this.state.theme==='light' ? 'Config-light' : 'Config-dark'}>Current ID: {this.state.accountId}</p>
                    </div>
                </div>
            )
        }
    }
}