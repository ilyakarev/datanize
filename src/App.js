import React, {Component} from 'react';
import _ from 'lodash';
import '../css/style.css';
import '../css/font-awesome.min.css';

const session = {
        startTime: 1489390133   , // timestamp
        endTime: 1489394933 // timestamp
    },
    commands = [{
        timestamp: 1489394933,// timestamp
        commandName: 'Added Person', // human readable command
        commandType: 'id-card', // font awesome icon name without prefix
        createdBy: 1, // teacher id
        sentTo: [1, 89, 100] // student ids
    },{
        timestamp: 1489393733,// timestamp
        commandName: 'Lock', // human readable command
        commandType: 'lock', // font awesome icon name without prefix
        createdBy: 1, // teacher id
        sentTo: [67, 89, 100] // student ids
    },{
        timestamp: 1489394233,// timestamp
        commandName: 'Send paper', // human readable command
        commandType: 'paper-plane-o', // font awesome icon name without prefix
        createdBy: 1, // teacher id
        sentTo: [1, 89, 100,5,9,10,67] // student ids
    }],
    students = [{
        id: 67,
        name: 'Jane Doe'
    },{
        id: 1,
        name: 'Jane Dowe'
    },{
        id: 89,
        name: 'Jack Russel'
    },{
        id: 100,
        name: 'Hellen Smith'
    },{
        id: 5,
        name: 'James Smith'
    },{
        id: 9,
        name: 'Lora Calborn'
    },{
        id: 10,
        name: 'Jessica Alba'
    }],
    teachers = [{
        id: 1,
        name: 'Mrs.Teacher'
    }];
const sortedStudents = {}; students.forEach((student)=>{
    sortedStudents[student.id]=student;
});
const sortedTeachers = {}; teachers.forEach((teacher)=>{
    sortedTeachers[teacher.id]=teacher;
});
const printNames = (arr)=>{
    let names = [];
    for(let i=0;i<6;i++){
        let obj = sortedStudents[arr[i]];
        if(typeof obj !== 'undefined'){
            names.push(sortedStudents[arr[i]].name);
        }
    }
    return names.join(', ');
};
const printOtherNames = (arr)=>{
    let names = [];
    for(let i=6;i<arr.length;i++){
        let obj = sortedStudents[arr[i]];
        if(typeof obj !== 'undefined'){
            names.push(sortedStudents[arr[i]].name);
        }
    }
    return ', '+names.join(', ');
};
const convertTimestamp = (timestamp)=>{
    let d = new Date(timestamp * 1000),
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2),
        ampm = 'AM',
        time;

    if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
    } else if (hh === 12) {
        h = 12;
        ampm = 'PM';
    } else if (hh === 0) {
        h = 12;
    }

    time = h + ':' + min + ' ' + ampm;
    return time;
};

let sortedCommands = _.sortBy(commands, [function(o) { return o.timestamp; }]);
sortedCommands = sortedCommands.reverse();

class Command extends Component{
    constructor(props){
        super(props);
        this.state = {allNames: false}
    }
    setCurrent(){
        const {command} = this.props;
        this.props.setcurrent(command.timestamp);
    }
    sayNames(e){
        this.setState({allNames: true});
    }
    render(){
        const {command} = this.props;
        const {allNames} = this.state;
        let cnt = command.sentTo.length;
        return(
            <div  className={!!command.current?"cd-timeline-block active cssanimations cd-bounce-1":"cd-timeline-block"}>
                <div className="cd-timeline-img cd-normal" onClick={(e)=>this.setCurrent(e)}>
                    <i className={"fa fa-"+command.commandType}></i>
                </div>
                <div className="cd-timeline-content">
                    <h2>{command.commandName}</h2>
                    <p>Sent by {sortedTeachers[command.createdBy].name}</p>
                    <h2>Send to {cnt} students</h2>
                    <p>
                        {printNames(command.sentTo)}
                        {cnt>6?<span className={allNames?'':'hidden'}>
                                {printOtherNames(command.sentTo)}
                                </span>:''}
                    </p>
                    {cnt>6?<span className={allNames?'hidden':''} onClick={(e) => this.sayNames(e)}>(and {cnt-6} more)</span>:''}
                    <span className="cd-date">{convertTimestamp(command.timestamp)}</span>
                </div>
            </div>
        )
    }
}
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {commands: sortedCommands};
    }
    setCurrent(id){
        let newCommands = commands.map(item =>
            item.timestamp === id ?
                { ...item, current: true } :
                { ...item, current: false }
        );
        let sortedCommands = _.sortBy(newCommands, [function(o) { return o.timestamp; }]);
        sortedCommands = sortedCommands.reverse();
        this.setState({commands: sortedCommands});
    }
    render() {
        const {commands} = this.state;

        return (
            <div>
                <section className="cd-container app">
                    <div className="cd-timeline-block active">
                        <div className="cd-timeline-img cd-end"></div>
                        <div className="cd-timeline-content --simple">
                            <p>{'Class session ended'}</p>
                            <span className="cd-date">{convertTimestamp(session.endTime)}</span>
                        </div>
                    </div>

                    {commands.map(command=>
                        <Command key={command.timestamp} command={command} setcurrent={this.setCurrent.bind(this)}/>
                    )}

                    <div className="cd-timeline-block active">
                        <div className="cd-timeline-img cd-start"></div>
                        <div className="cd-timeline-content --simple">
                            <p>Class session started</p>
                            <span className="cd-date">{convertTimestamp(session.startTime)}</span>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}


export default App;
