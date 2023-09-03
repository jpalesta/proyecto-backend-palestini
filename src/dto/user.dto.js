class UserDto {
    constructor(userDto) {
            (this.firstName = userDto.firstName),
            (this.lastName = userDto.lastName),
            (this.role = userDto.role),
            (this.email = userDto.email),
            (this.age = userDto.age),
            (this.lastConnection = userDto.lastConnection),
            (this.profileImage = userDto.profileImage),
            (this.id = userDto._id)
    }
}

module.exports = UserDto
