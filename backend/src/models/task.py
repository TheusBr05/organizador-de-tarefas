from sqlalchemy.sql import func
from . import db
from .user import User

class Task(db.Model):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    due_date = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(50), nullable=False, default='Pendente')  # e.g., Pendente, Em Andamento, Concluída
    priority = db.Column(db.String(50), nullable=False, default='Média') # e.g., Alta, Média, Baixa
    responsible = db.Column(db.String(100), nullable=True)
    responsible_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    parent_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=True)
    # Corrected backref and remote_side for self-referential relationship
    subtasks = db.relationship('Task', backref=db.backref('parent', remote_side=[id]), lazy='dynamic')

    def __repr__(self):
        return f'<Task {self.id}: {self.title}>'

    def to_dict(self, include_subtasks=True):
        task_dict = {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'status': self.status,
            'priority': self.priority,
            'responsible': self.responsible,
            'responsible_id': self.responsible_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'parent_id': self.parent_id
        }
        if include_subtasks:
            task_dict['subtasks'] = [subtask.to_dict(include_subtasks=False) for subtask in self.subtasks] # Avoid deep recursion for sub-subtasks in this representation
        return task_dict

