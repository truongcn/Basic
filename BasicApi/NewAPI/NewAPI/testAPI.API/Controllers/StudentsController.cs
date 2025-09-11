using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using testAPI.Application.Interfaces;
using testAPI.testAPI.Aplication.DTOs;

namespace testAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly IStudentService _studentService;

        public StudentsController(IStudentService studentService)
        {
            _studentService = studentService;
        }

        [HttpGet]
        public IActionResult GetAll() => Ok(_studentService.GetAll());

        [HttpGet("{id:guid}")]
        public IActionResult GetById(Guid id)
        {
            var student = _studentService.GetById(id);
            if (student == null) return NotFound();
            return Ok(student);
        }

        [HttpPost]
        public IActionResult Add(AddStudentDto dto)
        {
            var student = _studentService.Add(dto);
            return Ok(student);
        }

        [HttpPut("{id:guid}")]
        public IActionResult Update(Guid id, UpdateStudentDto dto)
        {
            var student = _studentService.Update(id, dto);
            if (student == null) return NotFound();
            return Ok(student);
        }

        [HttpDelete("{id:guid}")]
        public IActionResult Delete(Guid id)
        {
            var success = _studentService.Delete(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
