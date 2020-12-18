// import Dexie from 'dexie';

// interface IFriend {
//     id?: number;
//     name?: string;
//     age?: number;
// }

// //
// // Declare Database
// //
// class FriendDatabase extends Dexie {
//     friends: Dexie.Table<IFriend,number>;

//     constructor() {
//         super("FriendsDatabase");
//         this.version(1).stores({
//             friends: "++id,name,age"
//         });
//     }
// }

// var db = new FriendDatabase();
// //
// // Manipulate and Query Database
// //
// db.friends.add({name: "Josephine", age: 21}).then(()=>{
//     return db.friends.where("age").below(25).toArray();
// }).then(youngFriends => {
//     alert ("My young friends: " + JSON.stringify(youngFriends));
// }).catch(e => {
//     alert("error: " + e.stack || e);
// });

import Dexie from 'dexie';


//input tags

const userId = document.getElementById('userId') as HTMLInputElement;
const proName = document.getElementById('proName') as HTMLInputElement;
const seller = document.getElementById('seller') as HTMLInputElement;
const price = document.getElementById('price') as HTMLInputElement;

//buttons

const btnCreate = document.getElementById('btnCreate');
const btnRead = document.getElementById('btnRead');
const btnUpdate = document.getElementById('btnUpdate');
const btnDelete = document.getElementById('btnDelete');

//notfound
const notfound = document.querySelector('.notfound');

interface isProduct {
    id?:number;
    name?:string;
    seller?:string;
    price?:number;
}

//declare DB

class ProductDb extends Dexie {
    products: Dexie.Table<isProduct,number>;

    constructor() {
        super('ProductsDb');
        this.version(1).stores({
            products: '++id,name,seller,price'
        });
    }
}

let db = new ProductDb();

const addProduct = (data:isProduct) => {
    db.products.add(data);
    
}

const filterPrice = async (price:number) => {
    return db.products.where('price').below(price);
}



// console.log(userId);
// console.log(proName);
// console.log(seller);
// console.log(price);

// console.log(btnCreate);
// console.log(btnRead);
// console.log(btnUpdate);
// console.log(btnDelete);

//  db.products.count(test => {
//      console.log(test);
//  })

 window.onload = () => {
    textID(userId);
 }

 const getMsg = (element:HTMLDivElement) => {
    element.classList.add('movedown');

    setTimeout(() => {
        element.classList.forEach(classname => {
            classname == 'movedown' ? undefined : element.classList.remove('movedown');
        });
    },4000)

 }

 const textID = (textboxId:any) => {
    db.products.count(num => {
        textboxId.value = num + 1 || 1;
    })
 }

//  console.log(typeof userId);


btnCreate.onclick = e => {
    e.preventDefault();

    addProduct({name:proName.value,seller:seller.value,price:price.valueAsNumber});

    proName.value = seller.value = price.value = '';

    getData(db.products, (data:any) => {
        userId.value = data.id + 1 || 1;
    })

    table();

    let insertmsg = document.querySelector('.insertmsg');

    console.log(insertmsg);


}

btnUpdate.onclick = () => {
    const id = parseInt(userId.value || '0');
    if(id) {

        db.products.update(id, {
            name: proName.value,
            seller: seller.value,
            price: price.valueAsNumber
        }).then(updated => {
            let get = updated ? true : false;

            let updatemsg = document.querySelector('.updatemsg') as HTMLDivElement;

            getMsg(updatemsg);


        })
    }
}

btnDelete.onclick = () => {
    db.delete();
    db = new ProductDb();
    table();
    
    textID(userId);

    let deletemsg = document.querySelector('.deletemsg') as HTMLDivElement;

    getMsg(deletemsg);
}





const createEle = (tagname:string,appendTo?:any,fn?:Function):void => {
    const elemment = document.createElement(tagname);
    if(appendTo) appendTo.append(elemment);
    if(fn) fn(elemment);
}

const sortObj = (sortobj:any) => {
    let obj = {};
    obj = {
        id:sortobj.id,
        name: sortobj.name,
        seller: sortobj.seller,
        price: sortobj.price

    }
    
    return obj;
}

const getData = (dbtable:any,fn:any) => {
    let index = 0;
    let obj = {};

    dbtable.count((num:any) => {
        if(num) {
            dbtable.each((table:any) => {

                obj = sortObj(table);

                fn(obj, index++);
            })
        } else {
            fn(0);
        }
    })
}




const table = ():void => {
    const tbody = document.getElementById('tBody');

    while(tbody.hasChildNodes()) {
        tbody.removeChild(tbody.firstChild);
    }
    getData(db.products, (data:any) => {
        if(data) {
            createEle('tr', tbody, (tr:any) => {
                for (const value in data) {
                    if(data.hasOwnProperty(value)) {

                        createEle('td',tr, (td:any) => {
                            td.textContent = data.price === data[value] ? `$${data[value]}` : data[value];
                        })
                    }
                }

                createEle('td', tr, (td:any) => {
                    createEle('i', td, (i:any) => {
                        i.className += 'fas fa-edit btn-edit';
                        i.setAttribute('data-id', data.id);
                        i.onclick = editbtn;
                    })
                })
                
                createEle('td',tr, (td:any) => {
                    createEle('i', td, (i:any) => {
                        i.className += 'fas fa-trash-alt btn-delete'
                        i.setAttribute('data-id', data.id);
                        i.onclick = deletebtn;
                    })
                })
            })
        } else {
            notfound.textContent = `No Record Found In Database`;
        }
    })

}

btnRead.onclick = table;

const editbtn = (e:any) => {

    let id:number = parseInt(e.target.dataset.id);
    db.products.get(id, (data:isProduct) => {

        userId.valueAsNumber = data.id || 0;
        proName.value = data.name || '';
        seller.value = data.seller || '';
        price.valueAsNumber = data.price || 0;
    })
}

const deletebtn = (e:any) => {
    let id:number = parseInt(e.target.dataset.id);
    db.products.delete(id);
    table();
}






