import React from 'react'
import Tooltip from './Tooltip'
import Navbar from './Navbar'
import Vote from './Vote'
import Authentication from '../../util/Authentication/Authentication'
import './App.css'

export default class App extends React.Component{
    constructor(props){
        super(props)
        this.Authentication = new Authentication()
  
        //if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null. 
        this.twitch = window.Twitch ? window.Twitch.ext : null
        this.state={
            finishedLoading:false,
            theme:'light',
            isVisible:true,
            event: null,
            voteEvent: null,
            isEventTab: true,
            streamerId: 123702490,
            channelId: 123,
            tooltipString: null,
            latency: null,
        }
        this.toggleTab = this.toggleTab.bind(this)
    }

    contextUpdate(context, delta){
        if(delta.includes('theme')){
            this.setState({ theme:context.theme })
        }
        // if (delta.includes('hlsLatencyBroadcaster')){
        //     this.setState({ latency: JSON.stringify(context), latency: JSON.stringify(delta) })
        // }
    }

    visibilityChanged(isVisible){
        this.setState(()=>{
            return {
                isVisible
            }
        })
    }

    componentDidMount(){
        if(this.twitch){
            this.twitch.configuration.onChanged(() => {
                if (this.twitch.configuration.broadcaster) {
                    try {
                        // Parsing the array saved in broadcaster content
                        var accountId = this.twitch.configuration.broadcaster.content;
                        this.setState({ streamerId: accountId }, () => {
                            this.events = new EventSource(`https://twitch-dota-extension-backend.herokuapp.com/events/${this.state.streamerId}`);
                            this.events.onmessage = (event) => {
                                console.log(newEvent)
                                const newEvent = JSON.parse(event.data)
                                if (newEvent.type == 'voteHero') {
                                    this.setState({ voteEvent: newEvent })
                                } else {
                                    this.setState({ event: newEvent })
                                }
                            };
                        })
                    } catch (e) {
                        console.log('Invalid config');
                    }
                }
            })
            this.twitch.onAuthorized((auth)=>{
                this.Authentication.setToken(auth.token, auth.userId)
                if(!this.state.finishedLoading){
                    // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.
                    // Look into initiating streamer session on backend
                    // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ channelId: `${auth.channelId}` })
                    };
                    fetch(`https://twitch-dota-extension-backend.herokuapp.com/init/${this.state.streamerId}`, requestOptions)
                        .then(response => response.json())
                    this.setState(()=>{
                        return {
                            finishedLoading: true,
                            channelId: auth.channelId
                        }
                    })
                }
            })


            this.twitch.listen('broadcast',(target,contentType,body)=>{
                this.twitch.rig.log(`New PubSub message!\n${target}\n${contentType}\n${body}`)
                // now that you've got a listener, do something with the result... 
                const { tooltipString } = JSON.parse(body)
                setTimeout(() => this.setState({tooltipString: tooltipString}), Math.round(this.state.latency*1000))
                // do something...

            })

            this.twitch.onVisibilityChanged((isVisible,_c)=>{
                this.visibilityChanged(isVisible)
            })

            // this.twitch.onContext((context,delta)=>{
            //     this.contextUpdate(context,delta)
            //     this.setState({ latency: context.hlsLatencyBroadcaster, context: delta.hlsLatencyBroadcaster })
            // })
            this.twitch.onContext((context, contextFields) => {
                if (context != undefined && context.hlsLatencyBroadcaster != undefined) {
                    this.setState({ latency: context.hlsLatencyBroadcaster })
                }
            })
        }

        // this.events = new EventSource(`https://twitch-dota-extension-backend.herokuapp.com/events/${this.state.streamerId}`);
        // this.events.onmessage = (event) => {
        //     console.log(newEvent)
        //     const newEvent = JSON.parse(event.data)
        //     if (newEvent.type == 'voteHero') {
        //         this.setState({ voteEvent: newEvent })
        //     } else {
        //         this.setState({ event: newEvent })
        //     }
        // };
    }
    
    toggleTab(value){
        // Todo: add isVoteActive on 2nd conditional
        if ((value && !this.state.isEventTab) || (!value && this.state.isEventTab)) {
            this.setState({ isEventTab: !this.state.isEventTab })
        }
    }

    componentWillUnmount(){
        if(this.twitch){
            this.twitch.unlisten('broadcast', ()=>console.log('successfully unlistened'))
        }
        sse.close();
    }
    render(){
        if(this.state.finishedLoading && this.state.isVisible){
            return (
                <>
                    <head>
                        <script src="https://extension-files.twitch.tv/helper/v1/twitch-ext.min.js"></script>
                    </head>
                    <div className="App">
                        <div className={this.state.theme === 'light' ? 'App-light' : 'App-dark'} >
                            <Navbar toggleTab={this.toggleTab}/>
                            {this.state.isEventTab ? <Tooltip tooltipString={this.state.tooltipString} /> 
                                : <Vote event={this.state.voteEvent} streamerId={this.state.streamerId}/>}
                            {/* <p>{this.state.latency}</p> */}
                        </div>
                    </div>
                </>
            )
        }else{
            return (
                <>
                    <head>
                        <script src="https://extension-files.twitch.tv/helper/v1/twitch-ext.min.js"></script>
                    </head>
                    <div className="App">
                        {/* <div className={this.state.theme === 'light' ? 'App-light' : 'App-dark'} > */}
                        <Navbar toggleTab={this.toggleTab}/>
                        {this.state.isEventTab ? <Tooltip tooltipString={this.state.tooltipString} /> 
                            : <Vote event={this.state.voteEvent} streamerId={this.state.streamerId}/>}
                    </div>
                </>
            )
        }

    }
}