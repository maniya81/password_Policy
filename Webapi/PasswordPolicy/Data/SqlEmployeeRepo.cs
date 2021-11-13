using PasswordPolicy.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace PasswordPolicy.Data
{
    public class SqlEmployeeRepo : IEmployeeRepo
    {
        private readonly PasswordContext _context;

        public SqlEmployeeRepo(PasswordContext context)
        {
            _context = context;
        }
        public IEnumerable<Employee> GetAll()
        {
            return _context.Employees.ToList();
        }
        public void CreateEmployee(Employee emp)
        {
            if (emp == null)
            {
                throw new ArgumentNullException(nameof(emp));
            }

            _context.Employees.Add(emp);
        }
        public void UpdateEmployee(Employee emp)
        {

        }
        public void DeleteEmployee(Employee emp)
        {
            if (emp == null)
            {
                throw new ArgumentNullException(nameof(emp));
            }
            _context.Employees.Remove(emp);
        }

        public Employee GetEmployeeById(int id)
        {
            return _context.Employees.FirstOrDefault(P => P.ID == id);
        }

        public bool SaveChanges()
        {
            return (_context.SaveChanges() > 0);
        }
    }
}
