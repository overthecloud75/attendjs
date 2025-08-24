from .db import BasicModel

class Employee(BasicModel):
    def __init__(self):
        super().__init__(model='employees')

    def get_list(self, date=None):
        employees = self.collection.find(sort=[('name', 1)])
        employees_list = []
        for employee in employees:
            # 퇴사하지 않은 직원만 포함
            if employee['regular'] != '퇴사':            
                if date:
                    if (date >= employee['beginDate'] and 'endDate' not in employee) or ('endDate' in employee and date <= employee['endDate']):
                        employees_list.append(employee)
                else:
                    employees_list.append(employee)
        return employees_list

    def get(self, employee_id=None):
        return self.collection.find_one({'employeeId': employee_id})

    def post(self, employee_id=None, name=None, begin_date=None):
        if employee_id and name and begin_date:
            employee = self.get(employee_id=employee_id)
            if not employee:
                self.collection.insert_one({'employeeId': employee_id, 'name': name, 'beginDate': begin_date, 'regular': '상근', 'mode': '내근', 'attendMode': 'X'})

    def get_approver(self, employee):
        approver = None
        if employee['position'] == '팀원':
            approver = self.collection.find_one({'position': '팀장', 'department': employee['department'], 'regular': {'$ne': '퇴사'}})
            if not approver:
                approver = self.collection.find_one({'position': '본부장', 'regular': {'$ne': '퇴사'}})
        elif employee['position'] == '팀장':
            approver = self.collection.find_one({'position': '본부장', 'regular': {'$ne': '퇴사'}})
        elif employee['position'] == '본부장':
            approver = employee
        elif employee['position'] == '대표이사':
            approver = employee
        else:
            approver = self.collection.find_one({'position': '본부장', 'regular': {'$ne': '퇴사'}})
        return approver
