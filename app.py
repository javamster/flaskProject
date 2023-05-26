from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import pymysql
from sqlalchemy import text
from flask import jsonify
from flask import session
from datetime import datetime
from flask import request
pymysql.install_as_MySQLdb()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://newuser:password@localhost/website_database'
db = SQLAlchemy(app)


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(1000), nullable=False)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(100), nullable=False)
    like_count = db.Column(db.Integer, default=0)
    dislike_count = db.Column(db.Integer, default=0)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100), nullable=False)


class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    image_url = db.Column(db.String(200), nullable=False)


class Comment(db.Model):
    __tablename__='comments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    comment = db.Column(db.String(500), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)


@app.route('/api/products')
def api_products():
    products = Product.query.all()
    product_list = []
    for product in products:
        image = Image.query.filter_by(product_id=product.id).first()
        product_dict = {
            "name": product.name,
            "desc": product.description,
            "price": str(product.price),
            "category": product.category,
            "imgSrc": image.image_url if image else "default.jpg"
        }
        product_list.append(product_dict)
    return jsonify(product_list)


@app.route('/api/products', methods=['POST'])
def add_product():
    product_data = request.json

    # Use your database connection to insert the new product
    new_product = Product(
        name=product_data["name"],
        description=product_data["desc"],
        price=product_data["price"],
        category=product_data["category"]
    )
    db.session.add(new_product)
    db.session.commit()

    # Add the image to the Image table
    new_image = Image(product_id=new_product.id, image_url=product_data["imgSrc"])
    db.session.add(new_image)
    db.session.commit()

    return jsonify({"success": True, "message": "Product added successfully"}), 201


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            session['user_id'] = user.id
            flash('Login successful', 'success')
            return {'success': True, 'redirect': url_for('homepage')}
        else:
            message = 'Email or password is incorrect, please try again'
            return {'success': False, 'message': message}
    return render_template('login.html')


@app.route('/check-login-status')
def check_login_status():
    if 'user_id' in session:
        return jsonify({'logged_in': True})
    else:
        return jsonify({'logged_in': False})


@app.route('/logout')
def logout():
    # remove the 'user_id' from the session if it is there
    session.pop('user_id', None)
    return redirect(url_for('login')) # or redirect to any other page


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        role = request.form['role']
        user = User.query.filter_by(email=email).first()
        if user:
            flash('Email already exists', 'danger')
        else:
            hashed_password = generate_password_hash(password, method='sha256')
            new_user = User(name=name, email=email, password=hashed_password, role=role)
            db.session.add(new_user)
            db.session.commit()
            flash('Registration successful', 'success')
            return redirect(url_for('product_list'))
    return render_template('register.html')


@app.route('/homepage')
def homepage():
    return render_template('homepage.html')


@app.route('/')
def product_list():
    return render_template('product-list.html')


@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/message-center')
def message_center():
    return render_template('message-center.html')


@app.route('/payment')
def payment():
    return render_template('payment.html')


@app.route('/shopping-cart')
def shopping_cart():
    return render_template('shopping-cart.html')


@app.route('/test_db')
def test_db():
    try:
        result = db.session.execute(text('SELECT 1'))
        return 'Database connection successful!'
    except Exception as e:
        return str(e)


@app.route('/product/<product_name>', methods=['GET', 'POST'])
def product_page(product_name):
    if request.method == 'POST':
        # 获取评论内容和用户名
        comment_text = request.form['comment']
        user_id = session.get('user_id')
        if not user_id:
            return {"message": "You must be logged in to comment"}, 401

        # 通过商品名称获取商品ID
        product = Product.query.filter_by(name=product_name).first()
        if product:
            product_id = product.id
            # 创建评论对象并保存到数据库
            comment = Comment(user_id=user_id, product_id=product_id, comment=comment_text)
            db.session.add(comment)
            db.session.commit()
        else:
            return {"message": "Product not found"}, 404

    # 获取商品信息
    product = Product.query.filter_by(name=product_name).first()
    if product:
        image = Image.query.filter_by(product_id=product.id).first()
        imgSrc = image.image_url if image else "default.jpg"
        comments = Comment.query.filter_by(product_id=product.id).all()
        if imgSrc.startswith('static/'):
            imgSrc = imgSrc[len('static/'):]
        product_dict = {
            "name": product.name,
            "desc": product.description,
            "price": str(product.price),
            "category": product.category,
            "imgSrc": imgSrc,
            "like_count": product.like_count,
            "dislike_count": product.dislike_count
        }
        comments_dict = [{"username": User.query.get(comment.user_id).name, "comment": comment.comment} for comment in
                         comments]
        return render_template('product.html', product=product_dict, comments=comments_dict)
    else:
        return "Product not found", 404


@app.route('/product/<product_name>/comment', methods=['POST'])
def add_comment(product_name):
    if 'user_id' not in session:
        return redirect(url_for('login'))
    # 假设用户已登录，其ID存储在session中
    user_id = session['user_id']
    comment_text = request.form['comment']
    product = Product.query.filter_by(name=product_name).first()
    if product:
        comment = Comment(user_id=user_id, product_id=product.id, comment=comment_text)
        db.session.add(comment)
        db.session.commit()
        return jsonify({'success': True, 'user_id': user_id})
    else:
        return jsonify({'success': False, 'message': 'Product not found'}), 404


@app.route('/product/<product_name>/like', methods=['POST'])
def like_product(product_name):
    product = Product.query.filter_by(name=product_name).first()
    if product:
        product.like_count += 1
        db.session.commit()
        return {'success': True, 'like_count': product.like_count}
    else:
        return {'success': False, 'message': 'Product not found'}, 404


@app.route('/product/<product_name>/dislike', methods=['POST'])
def dislike_product(product_name):
    product = Product.query.filter_by(name=product_name).first()
    if product:
        product.dislike_count += 1
        db.session.commit()
        return {'success': True, 'dislike_count': product.dislike_count}
    else:
        return {'success': False, 'message': 'Product not found'}, 404


if __name__ == '__main__':
    with app.app_context():
        try:
            db.create_all()
            print("Tables created successfully!")
        except Exception as e:
            print(f"Failed to create tables: {e}")
    app.run(debug=True)
