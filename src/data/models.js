// src/data/models.js

// --- Added Chore Status Constants ---
export const CHORE_STATUS = {
    PENDING: 'pending',       // Newly assigned, not yet completed
    COMPLETED: 'completed',   // Child marked as done, pending approval
    APPROVED: 'approved',     // Parent approved completion
    REJECTED: 'rejected',     // Parent rejected completion (e.g., needs redo)
    CANCELLED: 'cancelled',   // Chore cancelled by parent
    // Add other statuses if your logic requires them
};
// --- End Added Constants ---


// --- Existing Model Classes (Keep As Is) ---
class User {
    constructor(id, username, role, children = []) {
        this.id = id;
        this.username = username;
        this.role = role; // 'parent' or 'child'
        this.children = children; // Array of child User IDs for parents
    }
}

class Chore {
    constructor(id, name, description, points, frequency, assignedTo = null, createdAt = new Date()) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.points = points;
        this.frequency = frequency; // e.g., 'daily', 'weekly', 'onetime'
        this.assignedTo = assignedTo; // Child User ID or null
        this.createdAt = createdAt;
    }
}

class Task { // Represents an instance of a chore to be done
    constructor(id, choreId, userId, dueDate, status = CHORE_STATUS.PENDING, completedAt = null, proof = null, comments = []) {
        this.id = id;
        this.choreId = choreId; // Reference to Chore
        this.userId = userId;   // Reference to assigned Child User
        this.dueDate = dueDate;
        this.status = status;   // Use CHORE_STATUS constants
        this.completedAt = completedAt;
        this.proof = proof;     // URL or text description of completion proof
        this.comments = comments; // Array of comment objects { userId, text, timestamp }
    }
}

class Penalty {
    constructor(id, userId, reason, pointsDeducted, date = new Date()) {
        this.id = id;
        this.userId = userId; // Child User ID
        this.reason = reason;
        this.pointsDeducted = pointsDeducted;
        this.date = date;
    }
}

export { User, Chore, Task, Penalty }; // Keep existing exports
