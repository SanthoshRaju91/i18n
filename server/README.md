## Server documentation for the project.

This will server as a documentation for the server endpoints

### Non-Authenticated endpoint (NAE) - No need for token
### Authenticated endpoint (AE) - token is needed

1. GET getAppConfig - Get the application config (NAE)

    URL: /getAppConfig

    > request payload

    ```
    {}
    ```

    > response - success

    If configured.

    ``` 
    {
        "success": true,
        "salt": "e9a3bb6c075445b02386302c5a0698d9",
        "config": {
            "name": "Standard Chartered",
            "store": "FILE",
            "scm": "GIT",
            "scmURL": "https://api.github.com/",
            "location": "/Users/santhoshraju/Documents"
        }
    }
    ```

    If not configured.

    ```
    {
        "success": true,
        "salt": "e9a3bb6c075445b02386302c5a0698d9",
        "config": {}
    }
    ```

    > response - error

    ```
    {
        "success": false,
        message: 'Something went wrong'
    }
    ```

2. POST configure - Configure the application (NAE)

    URL: /configure

    > request payload

    ``` 
    {
        name: String,
        store: String, // either DB / FILE
        scm: String, // GIT / STASH
        scmURL: String, // should be api URL only like 'https://api.github.com/'
        location: String // location of the FILE DB
    }    
    ```

    > repsonse - success

    ```javascript
    {
        "success": true
    }    
    ```

    > response - error

    ```
    {
        "success": false,
        message: 'Something went wrong'
    }    
    ```

3. POST checkConnection - Checking the mongoDB connection (NAE)

    URL: /checkConnection

    > request payload

    ```
    {
        mongoURL: ''
    }
    ```

    > response - success

    ```
    {
        success: true,
        connected: true /false
    }
    ```

    > response - error

    ```
    {
        success: false,
        message: 'Something went wrong'
    }
    ```
4. POST /authenticate - To Authenticate a SCM user (NAE).

    URL: /authenticate

    > request payload

    ```
    {
        username: '',
        password: '' // this should be encrypted password
    }
    ```

    > response - success

    ```
    {
        success: true,
        token: '',
        name: 'Santhosh Raju'
    }
    ```

    > response - error

    ```
    {
        success: false,
        message: ''
    }
    ```

5. POST /addNewLanguage - Adding new language (AE).

    URL: /api/addNewLanguage

    > request

    ```
    {
        key: 'en',
        label: 'English',
        translation: {
            login: {
                message: 'Login'
            }
        }
    }
    ```

    > response - success

    ```
    {
        success: true,
        message: ''New language added
    } 
    ```

    > response - error
    
    ```
    {
        success: false,
        message: 'Could not add new language'
    }
    ```

6. POST /addNewKey - Adding new key to existing JSON

    URL: /api/addNewKey

    > request

    ```
    {
        keyPath: 'dashboard.cardlib',
        key: 'message',
        value: 'Message'
    }
    ```

    > response - success

    ```
    {
        success: true,
        message: 'New key added to the path'
    }
    ```

    > response - error

    ```
    {
        success: false,
        message: 'Could not add new key'
    }
    ```

7. GET /getTranslation/:lang - Get the translation for the given language

    URL: /api/getTranslation/en or /api/getTranslation/zh

    > request

    ```
    {

    }
    ```

    > response - success

    ```
    {
        success: true,
        translation: {
            login: {
                message: 'Message'
            }
        }
    }
    ```

    > response - error

    ```
    {
        success: false,
        message: 'Something went wrong'
    }
    ```

8. POST /delete - Delete a key from the translation file

    URL: /api/delete

    > request

    ```
    {
        keyPath: 'dashboard.cardlib.message'
    }
    ```

    > response - success

    ```
    {
        success: true,
        message: 'Deleted'        
    }
    ```

    > response - error

    ```
    {
        success: false,
        message: 'Unable to delete'
    }
    ```

9. POST /update - Updating a key's value

    URL: /api/update

    > request 

    ```
    {
        lang: 'en',
        translation: {
            login: {
                message: 'Updated message'
            }
        } 
    }
    ```

    > response - success

    ```
    {
        success: true,
        message: 'Value updated'
    }
    ```

    > response - error

    ```
    {
        success: false,
        message: 'Value not updated'
    }
    ```

10. GET /activities/last - Get the last commit activity on the JSON file.

    URL: /api/activities/last

    > request

    ```
    {

    }
    ```

    > response - success

    ```
    {
        success: true,
        activity: {
            user: 'John Doe',
            message: 'Added new language English - (en)',
            date: ''
        }
    }
    ```

    > response - error

    ```
    {
        success: false,
        message: 'Something went wrong'
    }
    ```

11. GET /activities/all - Get all the activities done.

    URL: /api/activities/all

    > request

    ```
    {

    }
    ```

    > response - success

    ```
    {
        success: true,
        activites: [{
            user: 'John Doe',
            message: 'Added new language English - (en)',
            date: ''
        }]
    }
    ```

    > response - error

    ```
    {
        success: false,
        message: 'Something went wrong'
    }
    ```