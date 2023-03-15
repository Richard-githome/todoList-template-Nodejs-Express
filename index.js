//requiring all needed dependencies for the todolist app................................
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');

//setting up the necessary dependencies.................................................
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view-engine', 'ejs');
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

//connecting mongoDB using mongoose.....................................................
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});

//creating Schema for the data collection...............................................
const itemSchema = ({
    name: String
});

const listSchema = ({
    name: String,
    items: [itemSchema]
})

//creating models for the Schema data collection.........................................
const Item = mongoose.model('Item', itemSchema);

const List = mongoose.model('List', listSchema);

//Below are the default data for the app................................................
const item1 = new Item({
    name: 'Welcome, friend! Feel free & have fun 🤩'
});

const item2 = new Item({
    name: 'Add your list(s) below 👇'
});

const itemDefArray = [item1, item2];

//code-block for the root route ('/') app.get............................................
app.get('/', (req, res) => {
    Item.find().then((foundDefItems) => {
        if(foundDefItems.length === 0) {
            return Item.insertMany(itemDefArray);
//            setTimeout(() => {res.redirect('/')}, 100);
        } else {
            return foundDefItems;
        }
    }).then((foundDefItems) => {
        res.render('list.ejs', {
        listTitle: "Today",
        newItems: foundDefItems
        });
    });
});

//code-block for the custom route ('/route/:') app.get...................................
app.get('/lists/:customListName', (req, res) => {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}).then((foundListArray) => {
        if(!foundListArray) {
            const list = new List({
                name: customListName,
                items: itemDefArray
            });
            list.save();
            setTimeout(() => {res.redirect('/lists/' + customListName)}, 100);
        } else {
            res.render('list.ejs', {
                listTitle: foundListArray.name,
                newItems: foundListArray.items
            });
        }
    });
});

//...............................................................
app.post('/', (req, res) => {
    const newItems = req.body.newItems;
    const newItemButton = req.body.newItemButton;

    const itemí = new Item({
        name: newItems
    });

    if(newItemButton === 'Today') {
        itemí.save();
        setTimeout(() => {res.redirect('/')}, 100);
    } else {
        List.findOne({name: newItemButton}).then((foundList) => {
            foundList.items.push(itemí);
            foundList.save();
            setTimeout(() => {res.redirect('/lists/' + newItemButton)}, 100);
        });
    }
});

app.post('/delete', (req, res) => {
    const checkbox = req.body.checkbox;
    const delItemButton = req.body.delItemButton;
    if(delItemButton === 'Today') {
        Item.findByIdAndDelete({_id: checkbox}).then(() => {
            setTimeout(() => {res.redirect('/')}, 100)
        });
    } else {
        List.findOneAndUpdate({name: delItemButton}, {$pull: {items: {_id: checkbox}}}).then(() => {
            setTimeout(() => {res.redirect('/lists/' + delItemButton)}, 100)
        });
    }
});

//.............................................................................................
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//.............................................................................................