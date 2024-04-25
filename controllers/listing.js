const Listing = require("../models/listing");

module.exports.index = async (req, res) => {

    const allListings = await Listing.find();
    // console.log(allListings)
    res.render('listing/index.ejs', { allListings })
}

module.exports.renderNewForm = async (req, res) => {
    res.render('listing/new.ejs');
}



module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    // console.log(list);
    if (!list) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listing")
    }
    res.render('listing/details.ejs', { list })
}




module.exports.renderEditForm = async (req, res) => {
    // console.log('eidt' , req.params)
    let { id } = req.params;
    let list = await Listing.findById(id);
    if (!list) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listing")
    }

    let originalUrl = list.image.url;
    originalUrl  = originalUrl.replace("/upload","/upload/w_250");
    res.render('listing/edit.ejs', { list ,originalUrl});
}




module.exports.createListing = async (req, res, next) => {
  let url= req.file.path;
  let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename}
    await newListing.save();
    req.flash("success", "New listing created");
    res.redirect('/listing');

}




module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
const listing = await Listing.findByIdAndUpdate(id,{...req.body.listing})
console.log(listing);

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename
        listing.image = {url,filename}
        await listing.save();
    }
    console.log(listing)
    req.flash("success", "Listing Updated");
    res.redirect('/listing')

    // console.log('--- ', req.params)
    // let { id } = req.params;
    // let { title, description, image, price, country, location } = req.body;
    // let list = await Listing.findByIdAndUpdate(id, {
    //     title: title, description: description,
    //     price: price, image: image,
    //     country: country, location: location
    // });

    // if(typeof req.file !== "undefined"){
    //     let url = req.file.path;
    //     let filename = req.file.filename
    //     list.image = {url,filename}
    //     await list.save();
    // }
    // console.log(list)
    // req.flash("success", "Listing Updated");
    // res.redirect('/listing')
}



module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id).then(res => {
        console.log('deleted Successfully');
    })
    req.flash("success", "Listing Deleted");
    res.redirect('/listing')
}