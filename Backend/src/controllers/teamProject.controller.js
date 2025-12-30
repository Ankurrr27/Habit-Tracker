import TeamProject from "../models/teamProject.model.js";
import Team from "../models/team.model.js";

export const createProject = async (req, res) => {
  const { teamId } = req.params;
  const { title, description } = req.body;

  const team = await Team.findById(teamId);
  if (!team) return res.status(404).json({ message: "Team not found" });

  const isMember = team.members.some(
    (m) => m.user.toString() === req.user.id
  );

  if (!isMember) {
    return res.status(403).json({ message: "Not a team member" });
  }

  const project = await TeamProject.create({
    team: teamId,
    title,
    description,
    createdBy: req.user.id,
  });

  res.status(201).json(project);
};
