from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import ARRAY

db = SQLAlchemy()

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    gender = db.Column(db.String(6), nullable=False)
    role = db.Column(db.String(50), default="User")

    def __init__(self, name, gender, role="User"):
        self.name = name
        self.gender = gender
        self.role = role

    def __repr__(self):
        return f"<User {self.name}>"

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'gender': self.gender,
            'role': self.role
        }

class Categories(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(1000))
    product_count = db.Column(db.Integer, default=0, nullable=False)

    products = db.relationship('Products', back_populates='category_ref')
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'product_count': self.product_count,
            'products': [p.serialize() for p in self.products],
        }

class Products(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    image = db.Column(db.String(500))
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(1000))
    price = db.Column(db.Numeric(10, 2))
    stock = db.Column(db.Integer)
    creation_date = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    category_ref = db.relationship('Categories', back_populates='products')

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'image': self.image,
            'description': self.description,
            'category': self.category_ref.name if self.category_ref else None,
            "category_id": self.category_id,
            'price': str(self.price),
            'stock': self.stock,
            'creation_date': self.creation_date.isoformat(),
        }