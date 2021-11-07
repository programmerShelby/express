const express = require('express')

const mongoose = require('mongoose')

const app = express()

//允许express 进行处理提交的数据
app.use(express.json())

/* 
    解决跨域问题
        1.安装包 npm i cors
        2.进行调用 app.use(require('cors')())
*/
app.use(require('cors')())

//连接数据库
mongoose.connect('mongodb://localhost:27017/express-test',{
    //旧的已经过时，需要使用新的
    useNewUrlParser:true
})

const Product = mongoose.model('Product',new mongoose.Schema({
    title : String,
}))
//插入数据
/* 
    Product.insertMany([
    {title : '产品1'},
    {title : '产品2'},
    {title : '产品3'},
]) */

//根目录接口
app.use('/',express.static('public'))
//about接口
app.get('/about',function(req,res){
    res.send({page:'About us'})
})

/* 
    find()方法：
        -limit(num)  限制查找几条数据
        -skip(num)  跳过几条数据
        -where()  限制查询条件
            ({
                查询条件
                栗子： title:'产品2'
            })
        -sort()  查找排序方法
            -sort({ _id : 1 })  
                1 表示正序 即按数据先后 -1 表示反序 按数据后先


*/
//产品接口
app.get('/products',async function(req,res){
    //const data = await Product.find().skip(1).limit(2)
    /* const data = await Product.find().where({
        title:'产品2'
    }) */
    const data = await Product.find().sort({_id:-1})
    res.send(data)
})

//产品详细信息接口
//  : 表示任意字符  id 表示接受这些任意字符以便后续使用
app.get('/products/:id',async function(req,res){
    //req.params  表示客户端传来的所有参数
    const data = await Product.findById(req.params.id)
    res.send(data)//返回一个对象而非数组
})

app.post('/products',async function(req,res){
    //req.body  表示客户端传出来的数据
    const data = req.body
    const product = await Product.create(data)//插入数据
    res.send(product)
})

//修改产品信息接口
app.put('/products/:id',async function(req,res){
    const product = await Product.findById(req.params.id)
    product.title = req.body.title
    await product.save()
    res.send(product)
})

//删除产品信息接口
app.delete('/products/:id',async function(req,res){
    const product = await Product.findById(req.params.id)
    await product.remove()
    res.send({
        sucess : true
    })
})

app.listen(4000,()=>{
    console.log('Running!');
})