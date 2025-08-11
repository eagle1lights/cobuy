export type Privacy="private"|"shared"; export type TaskStatus="todo"|"doing"|"done";
export type Task={id:string;title:string;assignee?:string;dueDate?:string;status:TaskStatus;privacy:Privacy;note?:string};
export type PropertyItem={id:string;title:string;notes?:string;privacy:Privacy};
export type PollOption={id:string;text:string;votes:number};
export type Poll={id:string;question:string;options:PollOption[];quorumPct:number;deadlineISO:string;locked:boolean;resultOptionId?:string;voters:string[];visibleTo:Privacy};
