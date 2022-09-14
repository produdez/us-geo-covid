import * as commonHelper from '../helpers/common'
import camelcaseKeys from 'camelcase-keys'

export class JSONConstructed {
    // * This class represent object that can be constructed from JSON


    // ! NOTE: DO NOT make a constructor here
    /*
        Why?
        Because the constructor of a parent class does not have access to the attributes of a child class
        due to the execution order of the constructor being
        - child constructor called -> supper() -> parent constructor executed -> back to child -> child attributes are initialized
        that is why I must not (and could not) create a constructor here but instead
        use the fromJSON() method as the alternative constructor method
        of course the default constructor (automatically created) is still available to make a pre-defined initialized object
    */
    
    private getAttributeNames() {
        /* Return list of all !initialized! object keys */
        return Object.keys(this)
    }

    private assignFromMap(kwargs: Map<String, any>) {
        /* 
            Assign all attributes from an kwargs map
            Note that all attributes must be already initialized with some value
            for this to work properly (null for simplicity)
         */
        // ! extra unused keys from kwargs are ignored

        for (let key of this.getAttributeNames()) {
            let value = kwargs.get(key)
            this[key as keyof typeof this] = value
        }
    }

    public static fromJSON(json: { [k: string]: any }, convertJsonKey = true) {
        /*
            ! This is the object creation method!
            Object from json after converting json to map
            convertJsonKey option is for converting snakeCase keys to camelCase keys
            (such is the case for the json returned form our backend)
        */
        if (convertJsonKey) {
            json = camelcaseKeys(json) as { [k: string] : any }
        }

        let obj = new this()
        obj.assignFromMap(commonHelper.toMap(json))
        return obj

        /* HACK: How does this work?
            1. Class extending this have their default constructor to initialize
            2. So we create an empty object
            3. Then the assignFromMap() help to change the value of those constructors
            4. Object is returned

            Important thing this that this class does not have a constructor so that it wont override the functionality
            of the default constructor generated in the child classes. Cause we want those properties to be initialized
            before we change them.!!
        */
    }
}
