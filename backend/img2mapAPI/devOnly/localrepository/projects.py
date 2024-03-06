
#this is a singleton class in which we store all the projects
class Projects:
    _instance = None
    nextId = 1
    def __init__(self):
        self.projects = []
    def addProject(self, project):
        project.id = self.nextId
        self.nextId += 1
        self.projects.append(project)
        return project.id
    def getProjects(self):
        return self.projects
    def getProject(self, id):
        for project in self.projects:
            if project.id == id:
                return project
        #raise ecxeption if project not found
        raise Exception("Project not found")
    def removeProject(self, id):
        for project in self.projects:
            if project.id == id:
                self.projects.remove(project)
                return
        raise Exception("Project not found")
    def updateProject(self, id, project):
        for i in range(len(self.projects)):
            if self.projects[i].id == id:
                self.projects[i] = project
                return
        raise Exception("Project not found")
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Projects, cls).__new__(cls)
        return cls._instance