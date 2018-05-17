package client

import (
	"errors"
	"io"
	"io/ioutil"
	"os"

	"github.com/BurntSushi/toml"
)

var (
	// NoInertiaRemote is used to warn about missing inertia remote
	NoInertiaRemote = "No inertia remote"
)

// Config represents the current projects configuration.
type Config struct {
	Version   string       `toml:"version"`
	Project   string       `toml:"project-name"`
	BuildType string       `toml:"build-type"`
	Remotes   []*RemoteVPS `toml:"remote"`
}

// NewConfig sets up Inertia configuration with given properties
func NewConfig(version, project, buildType string) *Config {
	return &Config{
		Version:   version,
		Project:   project,
		BuildType: buildType,
		Remotes:   make([]*RemoteVPS, 0),
	}
}

// Write writes configuration to Inertia config file at path. Optionally
// takes io.Writers.
func (config *Config) Write(filePath string, writers ...io.Writer) error {
	if len(writers) == 0 && filePath == "" {
		return errors.New("nothing to write to")
	}

	var writer io.Writer

	// If io.Writers are given, attach all writers
	if len(writers) > 0 {
		writer = io.MultiWriter(writers...)
	}

	// If path is given, attach file writer
	if filePath != "" {
		w, err := os.OpenFile(filePath, os.O_WRONLY|os.O_CREATE, os.ModePerm)
		if err != nil {
			return err
		}

		// Overwrite file if file exists
		if _, err := os.Stat(filePath); !os.IsNotExist(err) {
			ioutil.WriteFile(filePath, []byte(""), 0644)
		} else if err != nil {
			return err
		}

		// Set writer
		if writer != nil {
			writer = io.MultiWriter(writer, w)
		} else {
			writer = w
		}
	}

	// Write configuration to writers
	encoder := toml.NewEncoder(writer)
	return encoder.Encode(config)
}

// GetRemote retrieves a remote by name
func (config *Config) GetRemote(name string) (*RemoteVPS, bool) {
	for _, remote := range config.Remotes {
		if remote.Name == name {
			return remote, true
		}
	}
	return nil, false
}

// AddRemote adds a remote to configuration
func (config *Config) AddRemote(remote *RemoteVPS) {
	config.Remotes = append(config.Remotes, remote)
}

// RemoveRemote removes remote with given name
func (config *Config) RemoveRemote(name string) bool {
	for index, remote := range config.Remotes {
		if remote.Name == name {
			remote = nil
			config.Remotes = append(config.Remotes[:index], config.Remotes[index+1:]...)
			return true
		}
	}
	return false
}
