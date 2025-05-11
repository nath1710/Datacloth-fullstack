"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Users, Products, Categories
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

main = Blueprint('main', __name__)

# Allow CORS requests to this API
CORS(main)


@main.route('/user', methods=['POST'])
def create_user():
    data = request.json
    name = data.get('name')
    gender = data.get('gender')
    role = data.get('role', "User")

    if '' in [name, gender]:
        return jsonify({
            'message': 'No value can be empty'
        }), 400

    if None in [name, gender]:
        return jsonify({
            'message': 'Name and Gender are required'
        }), 400

    user_exist = db.session.execute(
        db.select(Users).filter_by(name=name)).one_or_none()
    if user_exist:
        return jsonify({
            'message': 'User already exists'
        }), 400

    new_user = Users(name, gender, role)

    print(new_user.serialize())
    print(f"User created with ID: {new_user.id}")

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({
            "message": "User created successfully",
            "user": new_user.serialize()}), 201
    except Exception as e:
        db.session.rollback()
        print("Error:", e)
        return jsonify({"error": str(e)}), 500


@main.route('/users', methods=['GET'])
def get_users():
    try:
        users = db.session.execute(db.select(Users)).scalars().all()
        user_list = [user.serialize() for user in users]
        return jsonify(user_list), 200
    except Exception as error:
        print(f"Error fetching users: {error}")
        return jsonify({
            'message': 'Error fetching users'
        }), 500


@main.route('/products', methods=['GET'])
def get_products():
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        search = request.args.get('search', '').strip()
        offset = (page - 1) * limit

        query = db.select(Products)

        if search:
            search_pattern = f"%{search}%"
            query = query.where(
                Products.name.ilike(search_pattern)
            )

        total_products = db.session.execute(
            db.select(db.func.count()).select_from(query.subquery())
        ).scalar()

        products = db.session.execute(
            query.offset(offset).limit(limit)
        ).scalars().all()

        return jsonify({
            'total': total_products,
            'page': page,
            'limit': limit,
            'products': [product.serialize() for product in products]
        }), 200
    except Exception as error:
        print(f"Error fetching products: {error}")
        return jsonify({'message': 'Error fetching products'}), 500


@main.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    try:
        product = db.session.get(Products, id)
        if not product:
            return jsonify({'message': 'Product not found'}), 404
        return jsonify(product.serialize()), 200
    except Exception as error:
        print(f"Error fetching product: {error}")
        return jsonify({'message': 'Error fetching product'}), 500


@main.route('/products', methods=['POST'])
def create_product():
    try:
        data = request.json
        required_fields = ['name', 'category_id', 'price', 'stock']
        if not all(field in data for field in required_fields):
            return jsonify({'message': 'Missing required fields'}), 400

        new_product = Products(
            name=data['name'],
            category_id=data['category_id'],
            price=data['price'],
            stock=data['stock'],
            image=data.get('image', ''),
            description=data.get('description', '')
        )
        db.session.add(new_product)
        db.session.flush()

        category = db.session.get(Categories, data['category_id'])
        if category:
            category.product_count = category.product_count or 0
            category.product_count += 1

        db.session.commit()
        return jsonify(new_product.serialize()), 201
    except Exception as error:
        db.session.rollback()
        print(f"Error creating product: {error}")
        return jsonify({'message': 'Error creating product'}), 500


@main.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    try:
        product = db.session.get(Products, id)
        if not product:
            return jsonify({'message': 'Product not found'}), 404

        data = request.json
        old_category_id = product.category_id

        for field in ['name', 'category_id', 'price', 'stock', 'image', 'description']:
            if field in data:
                setattr(product, field, data[field])

        new_category_id = data.get('category_id')
        if new_category_id and new_category_id != old_category_id:
            old_cat = db.session.get(Categories, old_category_id)
            new_cat = db.session.get(Categories, new_category_id)
            if old_cat:
                old_cat.product_count -= 1
            if new_cat:
                new_cat.product_count += 1

        db.session.commit()
        return jsonify(product.serialize()), 200
    except Exception as error:
        db.session.rollback()
        print(f"Error updating product: {error}")
        return jsonify({'message': 'Error updating product'}), 500


@main.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    try:
        product = db.session.get(Products, id)
        if not product:
            return jsonify({'message': 'Product not found'}), 404

        category = db.session.get(Categories, product.category_id)
        if category and category.product_count > 0:
            category.product_count -= 1

        db.session.delete(product)
        db.session.commit()
        return jsonify({'message': 'Product deleted successfully'}), 200
    except Exception as error:
        db.session.rollback()
        print(f"Error deleting product: {error}")
        return jsonify({'message': 'Error deleting product'}), 500


@main.route('/categories', methods=['GET'])
def get_categories():
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        offset = (page - 1) * limit

        categories = db.session.execute(
            db.select(Categories).offset(offset).limit(limit)
        ).scalars().all()

        return jsonify([category.serialize() for category in categories]), 200
    except Exception as error:
        print(f"Error fetching categories: {error}")
        return jsonify({'message': 'Error fetching categories'}), 500


@main.route('/categories/<int:id>', methods=['GET'])
def get_category(id):
    try:
        category = db.session.get(Categories, id)
        if not category:
            return jsonify({'message': 'Category not found'}), 404
        return jsonify(category.serialize()), 200
    except Exception as error:
        print(f"Error fetching category: {error}")
        return jsonify({'message': 'Error fetching category'}), 500


@main.route('/categories', methods=['POST'])
def create_category():
    try:
        data = request.json
        if not data.get('name'):
            return jsonify({'message': 'Name is required'}), 400

        new_category = Categories(
            name=data['name'],
            description=data.get('description', '')
        )

        db.session.add(new_category)
        db.session.commit()
        return jsonify(new_category.serialize()), 201
    except Exception as error:
        db.session.rollback()
        print(f"Error creating category: {error}")
        return jsonify({'message': 'Error creating category'}), 500


@main.route('/categories/<int:id>', methods=['PUT'])
def update_category(id):
    try:
        category = db.session.get(Categories, id)
        if not category:
            return jsonify({'message': 'Category not found'}), 404

        data = request.json
        if 'name' in data:
            category.name = data['name']
        if 'description' in data:
            category.description = data['description']

        db.session.commit()
        return jsonify(category.serialize()), 200
    except Exception as error:
        db.session.rollback()
        print(f"Error updating category: {error}")
        return jsonify({'message': 'Error updating category'}), 500


@main.route('/categories/<int:id>', methods=['DELETE'])
def delete_category(id):
    try:
        category = db.session.get(Categories, id)
        if not category:
            return jsonify({'message': 'Category not found'}), 404

        if len(category.products) > 0:
            return jsonify({
                'message': 'Cannot delete category with associated products',
                'products': [p.serialize() for p in category.products.all()]
            }), 400

        db.session.delete(category)
        db.session.commit()
        return jsonify({'message': 'Category deleted successfully'}), 200
    except Exception as error:
        db.session.rollback()
        print(f"Error deleting category: {error}")
        return jsonify({'message': 'Error deleting category'}), 500
