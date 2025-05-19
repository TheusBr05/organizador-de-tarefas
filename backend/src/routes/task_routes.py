from flask import Blueprint, request, jsonify
from ..models import db
from ..models.task import Task

task_bp = Blueprint("task_bp", __name__, url_prefix="/api/tasks")

@task_bp.route("", methods=["POST"])
def create_task():
    data = request.get_json()
    if not data or not data.get("title"):
        return jsonify({"error": "Missing title"}), 400

    new_task = Task(
        title=data["title"],
        description=data.get("description"),
        due_date=data.get("due_date"), # Needs date parsing if string
        status=data.get("status", "Pendente"),
        priority=data.get("priority", "Média"),
        responsible=data.get("responsible"),
        responsible_id=data.get("responsible_id"),
        parent_id=data.get("parent_id")
    )
    # Handle due_date string to datetime conversion if necessary
    if new_task.due_date and isinstance(new_task.due_date, str):
        try:
            from datetime import datetime
            new_task.due_date = datetime.fromisoformat(new_task.due_date.replace("Z", "+00:00"))
        except ValueError:
            return jsonify({"error": "Invalid due_date format. Use ISO format."}), 400

    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.to_dict()), 201

@task_bp.route("", methods=["GET"])
def get_tasks():
    # Filter for top-level tasks only (tasks without a parent_id)
    tasks = Task.query.filter(Task.parent_id.is_(None)).order_by(Task.created_at.desc()).all()
    return jsonify([task.to_dict(include_subtasks=True) for task in tasks]), 200

@task_bp.route("/<int:task_id>", methods=["GET"])
def get_task(task_id):
    task = Task.query.get_or_404(task_id)
    return jsonify(task.to_dict(include_subtasks=True)), 200

@task_bp.route("/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.get_json()

    task.title = data.get("title", task.title)
    task.description = data.get("description", task.description)
    task.status = data.get("status", task.status)
    task.priority = data.get("priority", task.priority)
    task.responsible = data.get("responsible", task.responsible)
    task.responsible_id = data.get("responsible_id", task.responsible_id) # Allow changing responsible
    task.parent_id = data.get("parent_id", task.parent_id) # Allow changing parent

    due_date_str = data.get("due_date")
    if due_date_str:
        try:
            from datetime import datetime
            task.due_date = datetime.fromisoformat(due_date_str.replace("Z", "+00:00"))
        except ValueError:
            return jsonify({"error": "Invalid due_date format. Use ISO format."}), 400
    elif "due_date" in data and data["due_date"] is None: # Allow setting due_date to null
        task.due_date = None

    db.session.commit()
    return jsonify(task.to_dict(include_subtasks=True)), 200

@task_bp.route("/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    # Simple deletion. For cascading deletes or handling subtasks, more logic might be needed
    # or rely on DB cascade if configured in the model/DB.
    # For now, we assume direct deletion. If it has subtasks, they might become orphaned or deleted by cascade.
    # A more robust solution would iterate and delete subtasks or reassign them.

    # Explicitly delete subtasks first if not handled by DB cascade
    for subtask in task.subtasks:
        db.session.delete(subtask)
    # It's often better to configure cascade delete at the DB/ORM level.
    # The current model's subtasks relationship doesn't specify cascade delete.

    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task and its subtasks deleted successfully"}), 200

# Endpoint to create a subtask for a specific task
@task_bp.route("/<int:parent_task_id>/subtasks", methods=["POST"])
def create_subtask(parent_task_id):
    parent_task = Task.query.get_or_404(parent_task_id)
    data = request.get_json()
    if not data or not data.get("title"):
        return jsonify({"error": "Missing title for subtask"}), 400

    new_subtask = Task(
        title=data["title"],
        description=data.get("description"),
        due_date=data.get("due_date"), # Needs date parsing
        status=data.get("status", "Pendente"),
        priority=data.get("priority", "Média"),
        responsible=data.get("responsible"),
        responsible_id=data.get("responsible_id"),
        parent_id=parent_task_id
    )
    if new_subtask.due_date and isinstance(new_subtask.due_date, str):
        try:
            from datetime import datetime
            new_subtask.due_date = datetime.fromisoformat(new_subtask.due_date.replace("Z", "+00:00"))
        except ValueError:
            return jsonify({"error": "Invalid due_date format for subtask. Use ISO format."}), 400

    db.session.add(new_subtask)
    db.session.commit()
    return jsonify(new_subtask.to_dict(include_subtasks=False)), 201

