const mongoose = require('mongoose');
const Category = require('../MODELS/category_mod');

exports.save_category = (body) => {
    return new Promise((resolve, reject) => {
        const category = new Category({
            _id: mongoose.Types.ObjectId(),
            name: body.name
        });

        category
            .save()
            .then(() => {
                resolve({ status: 201, message: 'success' });
            })
            .catch(err => {
                const validation_errors = err.errors;
                if (validation_errors) {
                    reject({ status: 422, error: validation_errors });
                }
                else {
                    reject({ status: 500, error: 'Server error' });
                }
            });
    });
}

exports.find_categories = () => {
    return new Promise((resolve, reject) => {
        Category
            .find()
            .select('_id name')
            .exec()
            .then(result => {
                resolve({ status: 201, data: result });
            })
            .catch(() => {
                reject({ status: 500, error: 'Server error' });
            });
    });
}

exports.remove_category = (id) => {
    return new Promise((resolve, reject) => {
        Category
            .deleteOne({ _id: id })
            .exec()
            .then(result => {
                const removed_count = result.n;
                if (removed_count === 0) {
                    reject({ status: 404, error: 'No id found' });
                }
                else {
                    resolve({ status: 201, message: 'success' });
                }
            })
            .catch(() => {
                reject({ status: 500, error: 'Server error' });
            });
    });
}


//Search category should be here