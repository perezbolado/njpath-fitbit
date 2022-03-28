export class Stations{
    static recomended_names = {
            "NEWARK":{
                "name": "Newark"
            },

            "HARRISON" : {
                "name": "Harrison"
            },

            "HARRISON" : {
                "name": "Harrison"
            },

            "JOURNAL_SQUARE":{
                "name": "Journal Square",
            },

            "GROVE_STREET" :{
            "name": "Grove Street",
            },

            "EXCHANGE_PLACE" : {
                "name": "Exchange Place",
            },
            
            "WORLD_TRADE_CENTER" : {
                "name": "World Trade Center",
            },
            "NEWPORT":{
                "name": "Newport",
            },
            
            "HOBOKEN" : {
                "name": "Hoboken",
            },
            "CHRISTOPHER_STREET" :{
                "name": "Christopher Street"
            },
            "NINTH_STREET":{
                "name": "9th Street",
            },
            "FOURTEENTH_STREET":{
                "name": "14th Street",
            },
            "TWENTY_THIRD_STREET":{
                "name": "23rd Street",
            },
            "THIRTY_THIRD_STREET":{
                "name": "33rd Street",
            }
    };

    static getName(origin){
        if(origin in this.recomended_names)
            return this.recomended_names[origin].name
        else
            return origin
    }
}