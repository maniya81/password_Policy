using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using PasswordPolicy.Data;
using PasswordPolicy.Dtos;
using PasswordPolicy.EmailService;
using PasswordPolicy.Models;
using System;
using System.Collections.Generic;

namespace PasswordPolicy.Controllers
{
    //[Authorize]
    [Route("api/employee")]
    [ApiController]
    public class EmployeeController : Controller
    {
        private readonly IEmployeeRepo _repo;
        private readonly IMapper _mapper;

        public EmployeeController(IEmployeeRepo repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }


        //GET api/employee/
        [HttpGet]
        public ActionResult<IEnumerable<Employee>> GetAll()
        {
            var employees = _repo.GetAll();
            return Ok(employees);
        }

        //post api/employee
        [HttpPost]
        public ActionResult CreateEmployee([FromForm] IFormCollection values)
        {
            values.TryGetValue("values", out var emp);
            var result = JsonConvert.DeserializeObject<CreateEmployeeDto>(emp);
            var empModel = _mapper.Map<Employee>(result);

            _repo.CreateEmployee(empModel);
            _repo.SaveChanges();
            return NoContent();
        }

        //put api/employee/
        [HttpPut]
        public ActionResult UpdateEmployee([FromForm] IFormCollection values)
        {
            var key = values["key"][0];
            var employeeModelFromRepo = _repo.GetEmployeeById(Int32.Parse(key));
            if (employeeModelFromRepo == null)
            {
                return NotFound();
            }
            values.TryGetValue("values", out var emp);
            var result = JsonConvert.DeserializeObject<UpdateEmployeeDto>(emp);
            
            _mapper.Map(result, employeeModelFromRepo);
            _repo.UpdateEmployee(employeeModelFromRepo);

            _repo.SaveChanges();

            return NoContent();
        }

        //DELETE api/employee/{id}
        [HttpDelete]
        public ActionResult DeleteEmployee([FromForm] int key)
        {
            var employeeModelFromRepo = _repo.GetEmployeeById(key);
            if (employeeModelFromRepo == null)
            {
                return NotFound();
            }

            _repo.DeleteEmployee(employeeModelFromRepo);
            _repo.SaveChanges();

            return Ok("deleted Key");
        }

    }
}
