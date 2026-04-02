import Team from "../models/team.model.js";
import TeamProject from "../models/teamProject.model.js";
import TeamProjectTask from "../models/teamProjectTask.model.js";

async function getAuthorizedTeam(teamId, userId) {
  const team = await Team.findById(teamId);

  if (!team) {
    return null;
  }

  const membership = team.members.find(
    (member) => member.user.toString() === userId
  );

  if (!membership) {
    return false;
  }

  return team;
}

async function getAuthorizedProject(projectId, userId) {
  const project = await TeamProject.findById(projectId);

  if (!project) {
    return null;
  }

  const team = await getAuthorizedTeam(project.team, userId);
  if (!team) {
    return team;
  }

  return project;
}

export const getProjectWorkspace = async (req, res) => {
  try {
    const userId = req.user.id;

    const teams = await Team.find({
      "members.user": userId,
    })
      .populate("members.user", "name username avatar")
      .sort({ createdAt: -1 });

    const formattedTeams = teams.map((team) => ({
      _id: team._id,
      name: team.name,
      description: team.description || "",
      members: team.members.map((member) => ({
        _id: member._id,
        role: member.role,
        user: member.user,
      })),
    }));

    const teamIds = teams.map((team) => team._id);
    const projects = await TeamProject.find({
      team: { $in: teamIds },
    })
      .populate("createdBy", "name username")
      .sort({ createdAt: -1 });

    const projectIds = projects.map((project) => project._id);
    const tasks = await TeamProjectTask.find({
      project: { $in: projectIds },
    })
      .populate("assignedTo", "name username avatar")
      .populate("createdBy", "name username")
      .sort({ createdAt: -1 });

    res.json({
      teams: formattedTeams,
      projects,
      tasks,
    });
  } catch (err) {
    console.error("Get project workspace failed:", err);
    res.status(500).json({ message: "Failed to load project workspace" });
  }
};

export const createProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { teamId, name, description } = req.body;

    if (!teamId || !name?.trim()) {
      return res
        .status(400)
        .json({ message: "Team and project name are required" });
    }

    const team = await getAuthorizedTeam(teamId, userId);
    if (team === null) {
      return res.status(404).json({ message: "Team not found" });
    }
    if (team === false) {
      return res.status(403).json({ message: "Access denied" });
    }

    const project = await TeamProject.create({
      team: teamId,
      name: name.trim(),
      description: description?.trim() || "",
      createdBy: userId,
    });

    const populated = await TeamProject.findById(project._id).populate(
      "createdBy",
      "name username"
    );

    res.status(201).json(populated);
  } catch (err) {
    console.error("Create project failed:", err);
    res.status(500).json({ message: "Failed to create project" });
  }
};

export const createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      projectId,
      title,
      description,
      assignedTo,
      status,
      progress,
      dueDate,
    } = req.body;

    if (!projectId || !title?.trim() || !assignedTo) {
      return res.status(400).json({
        message: "Project, task title, and assignee are required",
      });
    }

    const project = await getAuthorizedProject(projectId, userId);
    if (project === null) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project === false) {
      return res.status(403).json({ message: "Access denied" });
    }

    const team = await Team.findById(project.team);
    const isAssigneeOnTeam = team.members.some(
      (member) => member.user.toString() === assignedTo
    );

    if (!isAssigneeOnTeam) {
      return res.status(400).json({
        message: "Assignee must be a member of the selected team",
      });
    }

    const task = await TeamProjectTask.create({
      project: projectId,
      title: title.trim(),
      description: description?.trim() || "",
      assignedTo,
      status: status || "todo",
      progress: Number(progress ?? 0),
      dueDate: dueDate || null,
      completed: (status || "todo") === "done",
      createdBy: userId,
    });

    const populated = await TeamProjectTask.findById(task._id)
      .populate("assignedTo", "name username avatar")
      .populate("createdBy", "name username");

    res.status(201).json(populated);
  } catch (err) {
    console.error("Create task failed:", err);
    res.status(500).json({ message: "Failed to create task" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;
    const task = await TeamProjectTask.findById(taskId).populate("project");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await getAuthorizedProject(task.project._id, userId);
    if (project === false) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updates = req.body || {};

    if (updates.title !== undefined) {
      task.title = updates.title.trim();
    }

    if (updates.description !== undefined) {
      task.description = updates.description.trim();
    }

    if (updates.status !== undefined) {
      task.status = updates.status;
      task.completed = updates.status === "done";
      if (updates.status === "done" && (updates.progress ?? task.progress) < 100) {
        task.progress = 100;
      }
    }

    if (updates.progress !== undefined) {
      task.progress = Number(updates.progress);
      if (task.progress >= 100) {
        task.status = "done";
        task.completed = true;
      } else if (task.status === "done") {
        task.status = "in_progress";
        task.completed = false;
      }
    }

    if (updates.assignedTo !== undefined) {
      const team = await Team.findById(task.project.team);
      const isAssigneeOnTeam = team.members.some(
        (member) => member.user.toString() === updates.assignedTo
      );

      if (!isAssigneeOnTeam) {
        return res.status(400).json({
          message: "Assignee must be a member of the selected team",
        });
      }

      task.assignedTo = updates.assignedTo;
    }

    if (updates.dueDate !== undefined) {
      task.dueDate = updates.dueDate || null;
    }

    await task.save();

    const populated = await TeamProjectTask.findById(task._id)
      .populate("assignedTo", "name username avatar")
      .populate("createdBy", "name username");

    res.json(populated);
  } catch (err) {
    console.error("Update task failed:", err);
    res.status(500).json({ message: "Failed to update task" });
  }
};
