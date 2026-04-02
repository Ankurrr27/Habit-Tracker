import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Plus, Users } from "lucide-react";
import api from "../api/axios";

const emptyProjectForm = {
  name: "",
  description: "",
};

const emptyTaskForm = {
  title: "",
  description: "",
  assignedTo: "",
  status: "todo",
  progress: 0,
  dueDate: "",
};

const statusOptions = [
  { value: "todo", label: "To do" },
  { value: "in_progress", label: "In progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
];

export default function ProjectPage() {
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [taskForm, setTaskForm] = useState(emptyTaskForm);
  const [loading, setLoading] = useState(true);
  const [savingProject, setSavingProject] = useState(false);
  const [savingTask, setSavingTask] = useState(false);
  const [message, setMessage] = useState("");
  const [showProjectForm, setShowProjectForm] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    api
      .get("/projects/workspace")
      .then((res) => {
        if (isCancelled) return;

        const nextTeams = res.data.teams || [];
        const nextProjects = res.data.projects || [];
        const nextTasks = res.data.tasks || [];

        setTeams(nextTeams);
        setProjects(nextProjects);
        setTasks(nextTasks);

        const firstTeamId = nextTeams[0]?._id || "";
        const firstProjectId =
          nextProjects.find((project) => project.team === firstTeamId)?._id ||
          "";

        setSelectedTeamId(firstTeamId);
        setSelectedProjectId(firstProjectId);
      })
      .catch((error) => {
        console.error("Project workspace error:", error);
        setMessage("Failed to load projects");
      })
      .finally(() => {
        if (!isCancelled) {
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const selectedTeam = useMemo(
    () => teams.find((team) => team._id === selectedTeamId) || null,
    [selectedTeamId, teams]
  );

  const teamProjects = useMemo(
    () => projects.filter((project) => project.team === selectedTeamId),
    [projects, selectedTeamId]
  );

  const selectedProject = useMemo(
    () =>
      teamProjects.find((project) => project._id === selectedProjectId) ||
      null,
    [selectedProjectId, teamProjects]
  );

  const projectTasks = useMemo(
    () => tasks.filter((task) => task.project === selectedProjectId),
    [tasks, selectedProjectId]
  );

  useEffect(() => {
    if (!selectedTeamId && teams[0]?._id) {
      setSelectedTeamId(teams[0]._id);
      return;
    }

    if (!teamProjects.some((project) => project._id === selectedProjectId)) {
      setSelectedProjectId(teamProjects[0]?._id || "");
    }
  }, [selectedProjectId, selectedTeamId, teamProjects, teams]);

  useEffect(() => {
    if (selectedTeam?.members?.[0]?.user?._id) {
      setTaskForm((prev) => ({
        ...prev,
        assignedTo: prev.assignedTo || selectedTeam.members[0].user._id,
      }));
    }
  }, [selectedTeam]);

  const handleCreateProject = async () => {
    if (!selectedTeamId || !projectForm.name.trim()) return;

    try {
      setSavingProject(true);
      const res = await api.post("/projects", {
        teamId: selectedTeamId,
        name: projectForm.name,
        description: projectForm.description,
      });

      setProjects((prev) => [res.data, ...prev]);
      setSelectedProjectId(res.data._id);
      setProjectForm(emptyProjectForm);
      setShowProjectForm(false);
      setMessage("Project created");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create project");
    } finally {
      setSavingProject(false);
    }
  };

  const handleCreateTask = async () => {
    if (!selectedProjectId || !taskForm.title.trim() || !taskForm.assignedTo) {
      return;
    }

    try {
      setSavingTask(true);
      const res = await api.post("/projects/tasks", {
        projectId: selectedProjectId,
        ...taskForm,
      });

      setTasks((prev) => [res.data, ...prev]);
      setTaskForm((prev) => ({
        ...emptyTaskForm,
        assignedTo: prev.assignedTo,
      }));
      setMessage("Task added");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create task");
    } finally {
      setSavingTask(false);
    }
  };

  const handleTaskPatch = async (taskId, patch) => {
    try {
      const res = await api.put(`/projects/tasks/${taskId}`, patch);
      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? res.data : task))
      );
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update task");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10 text-sm text-zinc-500">
        Loading projects...
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-8 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          Create a team first. Projects work inside teams, so once you have a team,
          you can assign tasks to the people in it.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      <section className="rounded-3xl border border-zinc-200 bg-white px-6 py-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Projects
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Pick a team, choose a project, then assign tasks to teammates.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="1. Choose team">
            <select
              value={selectedTeamId}
              onChange={(event) => setSelectedTeamId(event.target.value)}
              className={inputClass}
            >
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="2. Choose project">
            <select
              value={selectedProjectId}
              onChange={(event) => setSelectedProjectId(event.target.value)}
              className={inputClass}
            >
              <option value="">Select project</option>
              {teamProjects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowProjectForm((value) => !value)}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            <Plus size={15} />
            {showProjectForm ? "Cancel" : "Create new project"}
          </button>

          {selectedTeam && (
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Team members: {selectedTeam.members.length}
            </span>
          )}
        </div>

        {showProjectForm && (
          <div className="mt-5 grid gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <Field label="Project name">
              <input
                value={projectForm.name}
                onChange={(event) =>
                  setProjectForm((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
                placeholder="Website redesign"
                className={inputClass}
              />
            </Field>

            <Field label="Short description">
              <textarea
                rows={3}
                value={projectForm.description}
                onChange={(event) =>
                  setProjectForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                placeholder="What this project is about."
                className={inputClass}
              />
            </Field>

            <button
              onClick={handleCreateProject}
              disabled={savingProject}
              className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {savingProject ? "Creating..." : "Save project"}
            </button>
          </div>
        )}
      </section>

      {message && (
        <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          {message}
        </div>
      )}

      {selectedProject ? (
        <>
          <section className="rounded-3xl border border-zinc-200 bg-white px-6 py-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              {selectedProject.name}
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {selectedProject.description || "No description yet."}
            </p>
          </section>

          <section className="rounded-3xl border border-zinc-200 bg-white px-6 py-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Add task
            </h3>
            <div className="mt-4 grid gap-4">
              <Field label="Task name">
                <input
                  value={taskForm.title}
                  onChange={(event) =>
                    setTaskForm((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Write login page copy"
                  className={inputClass}
                />
              </Field>

              <Field label="Assign to">
                <select
                  value={taskForm.assignedTo}
                  onChange={(event) =>
                    setTaskForm((prev) => ({
                      ...prev,
                      assignedTo: event.target.value,
                    }))
                  }
                  className={inputClass}
                >
                  <option value="">Select teammate</option>
                  {(selectedTeam?.members || []).map((member) => (
                    <option
                      key={member.user?._id || member._id}
                      value={member.user?._id}
                    >
                      {member.user?.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Task note">
                <textarea
                  rows={3}
                  value={taskForm.description}
                  onChange={(event) =>
                    setTaskForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Extra details or what done means."
                  className={inputClass}
                />
              </Field>

              <button
                onClick={handleCreateTask}
                disabled={savingTask}
                className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {savingTask ? "Adding..." : "Add task"}
              </button>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Tasks
            </h3>

            {projectTasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-8 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                No tasks yet. Add the first task above.
              </div>
            ) : (
              projectTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  members={selectedTeam?.members || []}
                  onPatch={handleTaskPatch}
                />
              ))
            )}
          </section>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-8 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          Choose a project or create a new one to start assigning work.
        </div>
      )}
    </div>
  );
}

function TaskCard({ task, members, onPatch }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {task.title}
          </h4>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {task.description || "No note added."}
          </p>
        </div>
        <span className="rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          {task.status.replace("_", " ")}
        </span>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Field label="Person">
          <select
            value={task.assignedTo?._id || task.assignedTo}
            onChange={(event) =>
              onPatch(task._id, { assignedTo: event.target.value })
            }
            className={inputClass}
          >
            {members.map((member) => (
              <option
                key={member.user?._id || member._id}
                value={member.user?._id}
              >
                {member.user?.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Status">
          <select
            value={task.status}
            onChange={(event) =>
              onPatch(task._id, { status: event.target.value })
            }
            className={inputClass}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Progress">
          <select
            value={String(task.progress ?? 0)}
            onChange={(event) =>
              onPatch(task._id, { progress: Number(event.target.value) })
            }
            className={inputClass}
          >
            <option value="0">0%</option>
            <option value="25">25%</option>
            <option value="50">50%</option>
            <option value="75">75%</option>
            <option value="100">100%</option>
          </select>
        </Field>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Users size={13} />
        <span>
          {task.assignedTo?.name || task.assignedTo?.username || "Unknown"}
        </span>
        <span>•</span>
        <span>{task.progress ?? 0}% done</span>
        {task.dueDate && (
          <>
            <span>•</span>
            <span>Due {task.dueDate.slice(0, 10)}</span>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-200">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass = `
  w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm
  text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500
  dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100
`;
