import { checkForUpdate } from '../utils/objecter';

let lhs = {
    login: {
        message: 'Login message'
    }
};

let rhs = {
    login: {
        message: 'Login message',
        banner: 'Some banner'
    }
};

let result = checkForUpdate(lhs, rhs);

if(!result.updated) {
    console.log('==========');
    console.log('The updated obj is an add key operation');
};

lhs = {
    login: {
        message: 'Login message',
        banner: 'Some banner'
    }
};

rhs = {
    login: {
        message: 'Login message'
    }
};

result = checkForUpdate(lhs, rhs);

if(!result.updated) {
    console.log('==========');
    console.log('The updated obj is a delete key operation');
}

lhs = {
    login: {
        message: 'Login message',
        banner: 'Some banner'
    }
};

rhs = {
    login: {
        message: 'Login message',
        banner: 'Updated banner'
    }
};

result = checkForUpdate(lhs, rhs);

if(result.updated) {
    console.log('==========');
    console.log('Updated obj is an update key\'s value operation');
}