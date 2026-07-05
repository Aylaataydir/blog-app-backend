

# countOfVisitors

await Blog.findByIdAndUpdate(id,{
    $inc:{
        viewCount:1
    }
})


# likes 

**like eklemek**

await Blog.findByIdAndUpdate(id,{
    $addToSet:{
        likes:req.user.id
    }
})

!!! burda $addToSet operatoru ayni kulaniciyi iki kez eklemekz.

**like kaldirmak**

await Blog.findByIdAndUpdate(id,{
    $pull:{
        likes:req.user.id
    }
})


**Kontrol etmek**

blog.likes.includes(req.user.id)

veya

blog.likes.some(
    id=>id.equals(req.user.id)
)


# query handler types

 1.Express'in varsayılan tiplerini değiştirmek veya yeni özellik eklemek için .d.ts dosyası kullanılır. Biz Response'a getModelList ve getModelListDetails metodlarını bu şekilde ekledik.

 2.<T> (Generic) sayesinde tek bir fonksiyon tüm Mongoose modelleriyle çalışabilir. User, Blog, Category veya Comment modelini gönderdiğinde TypeScript modeli inceleyip T'yi otomatik belirler.
 
 3.TypeScript'te amaç sadece hataları engellemek değil, kodun niyetini açıkça ifade etmektir. Bu yüzden Record<string, unknown>, Model<T>, QueryHandlerQuery gibi tipler kullanarak hem daha güvenli hem de daha okunabilir bir kod yazmış olduk.