from flask import Flask, request, jsonify
from flask_cors import CORS
from models import SessionLocal, Item, init_db

init_db()

app = Flask(__name__)
CORS(app)

# simple helper
def serialize(item):
    return {
        "id": item.id,
        "name": item.name,
        "quantity": item.quantity,
        "unit": item.unit,
        "calories_per_unit": item.calories_per_unit,
        "total_calories": item.quantity * (item.calories_per_unit or 0),
    }

@app.route("/api/items", methods=["GET"])
def list_items():
    db = SessionLocal()
    items = db.query(Item).all()
    return jsonify([serialize(i) for i in items])

@app.route("/api/items", methods=["POST"])
def add_item():
    data = request.json
    name = data.get("name")
    quantity = float(data.get("quantity", 1))
    unit = data.get("unit", "pcs")
    calories = float(data.get("calories_per_unit", 0))

    db = SessionLocal()
    item = Item(name=name, quantity=quantity, unit=unit, calories_per_unit=calories)
    db.add(item)
    db.commit()
    db.refresh(item)
    return jsonify(serialize(item)), 201

@app.route("/api/items/<int:item_id>", methods=["PUT"])
def update_item(item_id):
    data = request.json
    db = SessionLocal()
    item = db.get(Item, item_id)
    if not item:
        return jsonify({"error": "not found"}), 404
    item.name = data.get("name", item.name)
    item.quantity = float(data.get("quantity", item.quantity))
    item.unit = data.get("unit", item.unit)
    item.calories_per_unit = float(data.get("calories_per_unit", item.calories_per_unit))
    db.commit()
    return jsonify(serialize(item))

@app.route("/api/items/<int:item_id>", methods=["DELETE"])
def delete_item(item_id):
    db = SessionLocal()
    item = db.get(Item, item_id)
    if not item:
        return jsonify({"error": "not found"}), 404
    db.delete(item)
    db.commit()
    return jsonify({"ok": True})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
